import { ExportOptions } from "dexie-export-import";

import { BackupRuntimeProxy } from "./proxy";

import {
  BackupCreateResult,
  BackupFile,
  BackupResponse,
  BackupTarget,
} from "../shared/types";
import {
  BACKUP_MIME_TYPE,
  CHUNK_SIZE_BYTES,
  MAX_DIRECT_BACKUP_UPLOAD_BYTES,
} from "../shared/constants";

import { IoService } from "../../storage/io";
import { StorageService } from "../../storage/storage";

import { getBackupFileName } from "../../../shared/string";
import { warn } from "../../../shared/extension/logger";
import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";
import { daysToMs } from "../../../utils/date";

type BackupUploadInput = {
  proxy: BackupRuntimeProxy;
  blob: Blob;
  settings: {
    fileName: string;
    target: BackupTarget;
    createdAt: number;
  };
};

export class BackupService {
  private readonly proxies = new Map<BackupProviderType, BackupRuntimeProxy>();

  private getProxy(providerType: BackupProviderType): BackupRuntimeProxy {
    let proxy = this.proxies.get(providerType);

    if (!proxy) {
      proxy = new BackupRuntimeProxy(providerType);
      this.proxies.set(providerType, proxy);
    }

    return proxy;
  }

  async create(
    providerType: BackupProviderType,
    exportOptions: ExportOptions = {},
  ): Promise<BackupResponse<BackupCreateResult>> {
    const proxy = this.getProxy(providerType);

    const isAvailable = await proxy.isAvailable();
    if (!isAvailable)
      return this.failure(`Backup provider is not available: ${providerType}.`);

    const configResult = await this.getConfig(providerType);
    if (!configResult.success) return configResult;
    const config = configResult.data!;

    const targetResult = this.requireData(
      await proxy.getTarget(config),
      `Could not get backup target for ${providerType}.`,
    );
    if (!targetResult.success) return targetResult;
    const target = targetResult.data!;

    const exportedResult = this.requireData(
      await IoService.export(exportOptions),
      "Could not export database.",
    );
    if (!exportedResult.success) return exportedResult;
    const exported = exportedResult.data!;

    const createdAt = Date.now();
    const settings = {
      fileName: getBackupFileName({
        datetime: createdAt,
        type: "backup",
        fileType: "json",
      }),
      target,
      createdAt,
    };

    const uploadedResult = this.requireData(
      exported.size <= MAX_DIRECT_BACKUP_UPLOAD_BYTES
        ? await this.uploadDirect({ proxy, blob: exported, settings })
        : await this.uploadStream({ proxy, blob: exported, settings }),
      "Could not upload backup.",
    );
    if (!uploadedResult.success) return uploadedResult;
    const uploaded = uploadedResult.data!;

    await StorageService.backupConfigs.update(providerType, {
      wasConnected: true,
      connected: true,
      lastBackedUpAt: createdAt,
      remoteTarget: target.id,
      remoteTargetName: target.name,
      remoteTargetKind: target.kind,
    });

    const pruneResult = await this.prune({
      providerType,
      target: target,
      maxBackups: config.maxBackups,
      maxAgeMs: config.maxAgeDays ? daysToMs(config.maxAgeDays) : undefined,
    });

    if (!pruneResult.success)
      warn(
        `Backup was created, but pruning failed for provider ${providerType}:`,
        pruneResult.error,
      );

    return this.success({
      file: uploaded,
    });
  }

  async prune({
    providerType,
    target,
    maxBackups,
    maxAgeMs,
  }: {
    providerType: BackupProviderType;
    target: BackupTarget;
    maxBackups?: number;
    maxAgeMs?: number;
  }): Promise<BackupResponse<void>> {
    const hasMaxAge = typeof maxAgeMs === "number" && maxAgeMs > 0;
    const hasMaxBackups = typeof maxBackups === "number" && maxBackups > 0;

    if (!hasMaxAge && !hasMaxBackups) return this.successVoid();

    const proxy = this.getProxy(providerType);
    const backups = await proxy.list(target);
    if (!backups.success)
      return this.failure(
        backups.error ?? "Could not list backups for pruning.",
      );
    if (!backups.data) return this.successVoid();

    const sorted = [...backups.data].sort((a, b) => b.createdAt - a.createdAt);
    const backupsToDelete = new Map<string, BackupFile>();

    if (hasMaxAge)
      for (const backup of sorted)
        if (this.isBackupExpired({ createdAt: backup.createdAt, maxAgeMs }))
          backupsToDelete.set(backup.id, backup);

    if (hasMaxBackups)
      for (const backup of sorted.slice(maxBackups))
        backupsToDelete.set(backup.id, backup);

    for (const backup of backupsToDelete.values()) {
      const deleted = await this.delete({
        providerType,
        fileId: backup.id,
      });
      if (!deleted.success) return deleted;
    }

    return this.successVoid();
  }

  async delete({
    providerType,
    fileId,
  }: {
    providerType: BackupProviderType;
    fileId: string;
  }): Promise<BackupResponse<void>> {
    const deleted = await this.getProxy(providerType).delete(fileId);

    if (!deleted.success)
      return this.failure(deleted.error ?? "Could not delete backup.");

    return this.successVoid();
  }

  async clear({
    providerType,
    target,
  }: {
    providerType: BackupProviderType;
    target: BackupTarget;
  }): Promise<BackupResponse<void>> {
    const cleared = await this.getProxy(providerType).clear(target);

    if (!cleared.success)
      return this.failure(cleared.error ?? "Could not clear backups.");

    await StorageService.backupConfigs.update(providerType, {
      remoteTarget: undefined,
      remoteTargetName: undefined,
      remoteTargetKind: undefined,
    });
    return this.successVoid();
  }

  private async getConfig(
    providerType: BackupProviderType,
  ): Promise<BackupResponse<BackupConfig>> {
    const config =
      await StorageService.backupConfigs.getByProvider(providerType);

    return this.requireData(
      config,
      `No backup config found for ${providerType}.`,
    );
  }

  private async uploadDirect({
    proxy,
    blob,
    settings: { fileName, target, createdAt },
  }: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    const content = await blob.text();

    const response = await proxy.directUpload({
      target: target,
      fileName: fileName,
      mimeType: BACKUP_MIME_TYPE,
      content,
      createdAt,
    });

    return response;
  }

  private async uploadStream({
    proxy,
    blob,
    settings: { fileName, target, createdAt },
  }: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    const started = this.requireData(
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
      const chunkBase64 = await this.blobToBase64(chunk);

      const uploaded = this.requireData(
        await proxy.uploadChunk({
          uploadId: started.data!.uploadId,
          chunkBase64,
          startByte: start,
          endByteExclusive: end,
          totalBytes: blob.size,
        }),
        "Could not upload backup chunk.",
      );
      if (!uploaded.success) return uploaded;

      if (uploaded.data!.done) finalFile = uploaded.data!.file;
    }

    if (!finalFile)
      return this.failure("Backup upload finished without file metadata.");

    return this.success(finalFile);
  }

  private isBackupExpired(backup: { createdAt: number; maxAgeMs: number }) {
    return Date.now() - backup.createdAt > backup.maxAgeMs;
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  private requireData<T>(
    response: BackupResponse<T>,
    fallbackError: string,
  ): BackupResponse<T> {
    if (!response.success || response.data === undefined)
      return this.failure(
        !response.success ? (response.error ?? fallbackError) : fallbackError,
      );

    return this.success(response.data);
  }

  private success<T>(data: T): BackupResponse<T> {
    return { success: true, data };
  }

  private successVoid(): BackupResponse<void> {
    return { success: true };
  }

  private failure<T = never>(error: unknown): BackupResponse<T> {
    return { success: false, error };
  }
}

export const backupService = new BackupService();
