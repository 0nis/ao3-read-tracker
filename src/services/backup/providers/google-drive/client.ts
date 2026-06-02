import { GoogleDriveFile } from "./types";
import {
  GOOGLE_DRIVE_API_BASE_URL,
  GOOGLE_DRIVE_BACKUP_APP_PROPERTIES,
  GOOGLE_DRIVE_BACKUP_FOLDER_APP_PROPERTIES,
  GOOGLE_DRIVE_BACKUP_FOLDER_NAME,
  GOOGLE_DRIVE_FILE_FIELDS,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GOOGLE_DRIVE_UPLOAD_BASE_URL,
} from "./constants";

type GetAccessToken = () => Promise<string>;

interface GoogleDriveListResponse {
  files?: GoogleDriveFile[];
  nextPageToken?: string;
}

export class GoogleDriveClient {
  constructor(private readonly getAccessToken: GetAccessToken) {}

  async getFile(fileId: string): Promise<GoogleDriveFile> {
    const params = new URLSearchParams({
      fields: GOOGLE_DRIVE_FILE_FIELDS,
    });

    return this.request<GoogleDriveFile>(
      `${GOOGLE_DRIVE_API_BASE_URL}/files/${encodeURIComponent(fileId)}?${params}`,
    );
  }

  async createBackupFolder(): Promise<GoogleDriveFile> {
    const params = new URLSearchParams({
      fields: GOOGLE_DRIVE_FILE_FIELDS,
    });

    return this.request<GoogleDriveFile>(
      `${GOOGLE_DRIVE_API_BASE_URL}/files?${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: GOOGLE_DRIVE_BACKUP_FOLDER_NAME,
          mimeType: GOOGLE_DRIVE_FOLDER_MIME_TYPE,
          appProperties: GOOGLE_DRIVE_BACKUP_FOLDER_APP_PROPERTIES,
        }),
      },
    );
  }

  async uploadBackup(input: {
    folderId: string;
    fileName: string;
    mimeType: string;
    content: string;
    createdAt: number;
  }): Promise<GoogleDriveFile> {
    const boundary = `ao3rt_${crypto.randomUUID()}`;

    const metadata = {
      name: input.fileName,
      parents: [input.folderId],
      mimeType: input.mimeType,
      appProperties: {
        ...GOOGLE_DRIVE_BACKUP_APP_PROPERTIES,
        createdAt: String(input.createdAt),
      },
    };

    const body = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      `Content-Type: ${input.mimeType}`,
      "",
      input.content,
      `--${boundary}--`,
      "",
    ].join("\r\n");

    const params = new URLSearchParams({
      uploadType: "multipart",
      fields: GOOGLE_DRIVE_FILE_FIELDS,
    });

    return this.request<GoogleDriveFile>(
      `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files?${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
  }

  async startResumableUpload(input: {
    folderId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: number;
  }): Promise<string> {
    const params = new URLSearchParams({
      uploadType: "resumable",
      fields: GOOGLE_DRIVE_FILE_FIELDS,
    });

    const metadata = {
      name: input.fileName,
      parents: [input.folderId],
      mimeType: input.mimeType,
      appProperties: {
        ...GOOGLE_DRIVE_BACKUP_APP_PROPERTIES,
        createdAt: String(input.createdAt),
      },
    };

    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${GOOGLE_DRIVE_UPLOAD_BASE_URL}/files?${params}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": input.mimeType,
          "X-Upload-Content-Length": String(input.sizeBytes),
        },
        body: JSON.stringify(metadata),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        body
          ? `Google Drive resumable upload failed: ${response.status} ${body}`
          : `Google Drive resumable upload failed: ${response.status}`,
      );
    }

    const location = response.headers.get("Location");
    if (!location)
      throw new Error("Google Drive did not return a resumable upload URL.");

    return location;
  }

  async uploadResumableChunk(input: {
    uploadUrl: string;
    chunk: Uint8Array;
    startByte: number;
    endByteExclusive: number;
    totalBytes: number;
  }): Promise<GoogleDriveFile | null> {
    const endByteInclusive = input.endByteExclusive - 1;

    const response = await fetch(input.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Range": `bytes ${input.startByte}-${endByteInclusive}/${input.totalBytes}`,
      },
      body: this.toArrayBuffer(input.chunk),
    });

    if (response.status === 308) return null;

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        body
          ? `Google Drive chunk upload failed: ${response.status} ${body}`
          : `Google Drive chunk upload failed: ${response.status}`,
      );
    }

    return (await response.json()) as GoogleDriveFile;
  }

  async listBackups(folderId: string): Promise<GoogleDriveFile[]> {
    const files: GoogleDriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        q: [
          `'${folderId}' in parents`,
          "trashed = false",
          "appProperties has { key='ao3rtKind' and value='backup' }",
        ].join(" and "),
        fields: `nextPageToken,files(${GOOGLE_DRIVE_FILE_FIELDS})`,
        pageSize: "100",
      });

      if (pageToken) params.set("pageToken", pageToken);

      const response = await this.request<GoogleDriveListResponse>(
        `${GOOGLE_DRIVE_API_BASE_URL}/files?${params}`,
      );

      files.push(...(response.files ?? []));
      pageToken = response.nextPageToken;
    } while (pageToken);

    return files;
  }

  async trashFile(fileId: string): Promise<void> {
    const params = new URLSearchParams({
      fields: "id,trashed",
    });

    await this.request<GoogleDriveFile>(
      `${GOOGLE_DRIVE_API_BASE_URL}/files/${encodeURIComponent(fileId)}?${params}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trashed: true,
        }),
      },
    );
  }

  private async request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        body
          ? `Google Drive request failed: ${response.status} ${body}`
          : `Google Drive request failed: ${response.status}`,
      );
    }

    if (response.status === 204) return undefined as T;

    return (await response.json()) as T;
  }

  private toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
  }
}
