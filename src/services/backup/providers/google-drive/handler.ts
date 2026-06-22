import { GoogleDriveClient } from "./client";
import { toBackupFile } from "./mapper";
import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "./constants";

import { BackupHandler } from "../base";

import { AuthProviderType } from "../../../auth/shared/enums";
import { authHandlerRegistry } from "../../../auth/background/registry";

import { base64ToBytes } from "../../shared/base64";
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
import {
  backupFailure,
  backupSuccess,
  backupSuccessVoid,
} from "../../shared/result";

import {
  BackupProviderType,
  RemoteTargetKind,
} from "../../../../enums/backups";
import { BackupConfig } from "../../../../types/backups";

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
      return Boolean(await this.getValidAccessToken());
    } catch {
      return false;
    }
  }

  async getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>> {
    try {
      if (config.remoteTarget) {
        const existing = await this.client.getFile(config.remoteTarget);

        if (this.isUsableBackupFolder(existing))
          return backupSuccess({
            id: existing.id,
            kind: RemoteTargetKind.FOLDER,
            name: existing.name,
          });
      }

      const created = await this.client.createBackupFolder();

      return backupSuccess({
        id: created.id,
        kind: RemoteTargetKind.FOLDER,
        name: created.name,
      });
    } catch (err) {
      return backupFailure(err);
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
      return backupSuccess(toBackupFile(uploaded));
    } catch (err) {
      return backupFailure(err);
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

      return backupSuccess({ uploadId });
    } catch (err) {
      return backupFailure(err);
    }
  }

  async uploadChunk(
    input: BackupUploadChunkInput,
  ): Promise<BackupUploadChunkResponse> {
    try {
      const uploadUrl = this.uploadSessions.get(input.uploadId);

      if (!uploadUrl)
        return backupFailure("Upload session not found: " + input.uploadId);

      const chunk = base64ToBytes(input.chunkBase64);

      const file = await this.client.uploadResumableChunk({
        uploadUrl,
        chunk,
        startByte: input.startByte,
        endByteExclusive: input.endByteExclusive,
        totalBytes: input.totalBytes,
      });

      if (!file) return backupSuccess({ done: false });

      this.uploadSessions.delete(input.uploadId);

      return backupSuccess({
        done: true,
        file: toBackupFile(file),
      });
    } catch (err) {
      return backupFailure(err);
    }
  }

  async list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>> {
    try {
      const files = await this.client.listBackups(target.id);

      return backupSuccess(files.map(toBackupFile));
    } catch (err) {
      return backupFailure(err);
    }
  }

  async delete(fileId: string): Promise<BackupResponse<void>> {
    try {
      await this.client.trashFile(fileId);
      return backupSuccessVoid();
    } catch (err) {
      return backupFailure(err);
    }
  }

  async clear(target: BackupTarget): Promise<BackupResponse<void>> {
    try {
      await this.client.trashFile(target.id);
      return backupSuccessVoid();
    } catch (err) {
      return backupFailure(err);
    }
  }

  private isUsableBackupFolder(file: {
    mimeType?: string;
    trashed?: boolean;
  }): boolean {
    return file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE && !file.trashed;
  }
}
