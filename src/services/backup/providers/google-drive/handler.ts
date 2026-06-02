import { BackupHandler } from "../base";

import { GoogleDriveClient } from "./client";
import { toBackupFile } from "./mapper";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "./constants";

import { AuthProviderType } from "../../../auth/shared/enums";
import { authHandlerRegistry } from "../../../auth/background/registry";

import {
  BackupProviderType,
  RemoteTargetKind,
} from "../../../../enums/backups";
import { BackupConfig } from "../../../../types/backups";
import {
  BackupStartUploadResponse,
  BackupUploadChunkResponse,
} from "../../shared/messages";
import {
  BackupDirectUploadInput,
  BackupFile,
  BackupProviderCapabilities,
  BackupResponse,
  BackupStartUploadInput,
  BackupTarget,
  BackupUploadChunkInput,
} from "../../shared/types";

export class GoogleBackupHandler implements BackupHandler {
  readonly provider = BackupProviderType.GOOGLE_DRIVE;

  readonly capabilities: BackupProviderCapabilities = {
    canTrash: true,
    canUseAppFolder: false,
    canUseUserFolder: true,
  };

  private readonly uploadSessions = new Map<string, string>();

  private async getValidAccessToken(): Promise<string> {
    const authHandler = authHandlerRegistry.get(AuthProviderType.GOOGLE);
    const token = await authHandler.getValidAccessToken();

    if (!token) throw new Error("Google Drive is not authenticated.");

    return token;
  }

  private readonly client = new GoogleDriveClient(async () => {
    return await this.getValidAccessToken();
  });

  async isAvailable(): Promise<boolean> {
    try {
      const available = Boolean(await this.getValidAccessToken());
      return available;
    } catch {
      return false;
    }
  }

  async getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>> {
    try {
      if (config.remoteTarget) {
        const existing = await this.client.getFile(config.remoteTarget);

        if (this.isUsableBackupFolder(existing))
          return {
            success: true,
            data: {
              id: existing.id,
              kind: RemoteTargetKind.FOLDER,
              name: existing.name,
            },
          };
      }

      const created = await this.client.createBackupFolder();

      return {
        success: true,
        data: {
          id: created.id,
          kind: RemoteTargetKind.FOLDER,
          name: created.name,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async uploadDirect(
    input: BackupDirectUploadInput,
  ): Promise<BackupResponse<BackupFile>> {
    try {
      const uploaded = await this.client.uploadBackup({
        folderId: input.target.id,
        fileName: input.fileName,
        mimeType: input.mimeType,
        content: input.content,
        createdAt: input.createdAt,
      });

      return {
        success: true,
        data: toBackupFile(uploaded),
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async startUpload(
    input: BackupStartUploadInput,
  ): Promise<BackupStartUploadResponse> {
    try {
      const uploadUrl = await this.client.startResumableUpload({
        folderId: input.target.id,
        fileName: input.fileName,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        createdAt: input.createdAt,
      });

      const uploadId = crypto.randomUUID();
      this.uploadSessions.set(uploadId, uploadUrl);

      return {
        success: true,
        data: { uploadId },
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async uploadChunk(
    input: BackupUploadChunkInput,
  ): Promise<BackupUploadChunkResponse> {
    try {
      const uploadUrl = this.uploadSessions.get(input.uploadId);

      if (!uploadUrl)
        return {
          success: false,
          error: "Backup upload session not found.",
        };

      const chunk = this.base64ToBytes(input.chunkBase64);

      const file = await this.client.uploadResumableChunk({
        uploadUrl,
        chunk,
        startByte: input.startByte,
        endByteExclusive: input.endByteExclusive,
        totalBytes: input.totalBytes,
      });

      if (!file)
        return {
          success: true,
          data: { done: false },
        };

      this.uploadSessions.delete(input.uploadId);

      return {
        success: true,
        data: {
          done: true,
          file: toBackupFile(file),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>> {
    try {
      const files = await this.client.listBackups(target.id);

      return {
        success: true,
        data: files.map(toBackupFile),
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async delete(fileId: string): Promise<BackupResponse<void>> {
    try {
      await this.client.trashFile(fileId);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  async clear(target: BackupTarget): Promise<BackupResponse<void>> {
    try {
      await this.client.trashFile(target.id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  private isUsableBackupFolder(file: {
    mimeType?: string;
    trashed?: boolean;
  }): boolean {
    return file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE && !file.trashed;
  }

  private base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }
}
