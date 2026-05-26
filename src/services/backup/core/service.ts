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
  MAX_DIRECT_BACKUP_UPLOAD_BYTES,
} from "../shared/constants";

import { IoService } from "../../storage/io";
import { StorageService } from "../../storage/storage";

import { getBackupFileName } from "../../../shared/string";
import { warn } from "../../../shared/extension/logger";
import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";
import { daysToMs } from "../../../utils/date";

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

    if (exported.size > MAX_DIRECT_BACKUP_UPLOAD_BYTES)
      return this.failure(
        `Backup file is too large for now (${exported.size} bytes). Max size is ${MAX_DIRECT_BACKUP_UPLOAD_BYTES} bytes.`,
      );

    const createdAt = Date.now();
    const content = await exported.text();

    const uploadedResult = this.requireData(
      await proxy.upload({
        target: target,
        fileName: getBackupFileName({
          datetime: createdAt,
          type: "backup",
          fileType: "json",
        }),
        mimeType: BACKUP_MIME_TYPE,
        content,
        createdAt,
      }),
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

  private isBackupExpired(backup: { createdAt: number; maxAgeMs: number }) {
    return Date.now() - backup.createdAt > backup.maxAgeMs;
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
