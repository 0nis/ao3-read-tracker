import { BackupRuntimeProxy } from "../proxy";
import {
  backupFailure,
  requireBackupData,
  backupSuccess,
} from "../../shared/result";
import { blobToBase64 } from "../../shared/base64";
import { BackupFile, BackupResponse, BackupTarget } from "../../shared/types";
import {
  BACKUP_MIME_TYPE,
  CHUNK_SIZE_BYTES,
  MAX_DIRECT_BACKUP_UPLOAD_BYTES,
} from "../../shared/constants";

export type BackupUploadSettings = {
  fileName: string;
  target: BackupTarget;
  createdAt: number;
};

export type BackupUploadInput = {
  proxy: BackupRuntimeProxy;
  blob: Blob;
  settings: BackupUploadSettings;
};

export class BackupUploader {
  async upload(input: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    return input.blob.size <= MAX_DIRECT_BACKUP_UPLOAD_BYTES
      ? await this.uploadDirect(input)
      : await this.uploadStream(input);
  }

  private async uploadDirect({
    proxy,
    blob,
    settings: { fileName, target, createdAt },
  }: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    return await proxy.directUpload({
      target,
      fileName,
      mimeType: BACKUP_MIME_TYPE,
      content: await blob.text(),
      createdAt,
    });
  }

  private async uploadStream({
    proxy,
    blob,
    settings: { fileName, target, createdAt },
  }: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    const started = requireBackupData(
      await proxy.startUpload({
        target,
        fileName,
        mimeType: BACKUP_MIME_TYPE,
        sizeBytes: blob.size,
        createdAt,
      }),
      "Could not start upload.",
    );

    if (!started.success) return started;

    let finalFile: BackupFile | undefined;

    for (let start = 0; start < blob.size; start += CHUNK_SIZE_BYTES) {
      const end = Math.min(start + CHUNK_SIZE_BYTES, blob.size);
      const chunk = blob.slice(start, end);

      const uploaded = requireBackupData(
        await proxy.uploadChunk({
          uploadId: started.data.uploadId,
          chunkBase64: await blobToBase64(chunk),
          startByte: start,
          endByteExclusive: end,
          totalBytes: blob.size,
        }),
        "Could not upload backup chunk.",
      );

      if (!uploaded.success) return uploaded;
      if (uploaded.data.done) finalFile = uploaded.data.file;
    }

    if (!finalFile)
      return backupFailure("Backup upload finished without file metadata.");

    return backupSuccess(finalFile);
  }
}
