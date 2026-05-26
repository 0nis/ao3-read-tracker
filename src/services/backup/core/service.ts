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
      return {
        success: false,
        error: `Backup provider is not available: ${providerType}`,
      };

    const configResult = await this.getConfig(providerType);
    if (!configResult.success || !configResult.data)
      return {
        success: false,
        error:
          !configResult.success && configResult.error
            ? configResult.error
            : `Could not get backup config for ${providerType}.`,
      };
    const config = configResult.data;

    const target = await proxy.getTarget(config);
    if (!target.success || !target.data)
      return {
        success: false,
        error:
          !target.success && target.error
            ? target.error
            : `Could not get backup target for ${providerType}.`,
      };

    const exported = await IoService.export(exportOptions);
    if (!exported.success || !exported.data)
      return {
        success: false,
        error: exported.error ?? "Could not export database.",
      };
    if (exported.data.size > MAX_DIRECT_BACKUP_UPLOAD_BYTES)
      return {
        success: false,
        error:
          "Backup is too large to upload through extension messaging right now.",
      };

    const createdAt = Date.now();
    const content = await exported.data.text();

    const uploaded = await proxy.upload({
      target: target.data,
      fileName: getBackupFileName({
        datetime: createdAt,
        type: "backup",
        fileType: "json",
      }),
      mimeType: BACKUP_MIME_TYPE,
      content,
      createdAt,
    });

    if (!uploaded.success || !uploaded.data)
      return {
        success: false,
        error:
          !uploaded.success && uploaded.error
            ? uploaded.error
            : "Could not upload backup.",
      };

    await StorageService.backupConfigs.update(providerType, {
      wasConnected: true,
      connected: true,
      lastBackedUpAt: createdAt,
      remoteTarget: target.data.id,
      remoteTargetName: target.data.name,
      remoteTargetKind: target.data.kind,
    });

    const pruneResult = await this.prune({
      providerType,
      target: target.data,
      maxBackups: config.maxBackups,
      maxAgeMs: config.maxAgeDays
        ? config.maxAgeDays * 24 * 60 * 60 * 1000
        : undefined,
    });

    if (!pruneResult.success)
      warn(
        `Backup was created, but pruning failed for provider ${providerType}:`,
        pruneResult.error,
      );

    return {
      success: true,
      data: {
        file: uploaded.data,
      },
    };
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

    if (!hasMaxAge && !hasMaxBackups) return { success: true, data: undefined };

    const proxy = this.getProxy(providerType);
    const backups = await proxy.list(target);
    if (!backups.success)
      return {
        success: false,
        error: backups.error ?? "Could not list backups for pruning.",
      };
    if (!backups.data) return { success: true, data: undefined };

    const sorted = [...backups.data].sort((a, b) => b.createdAt - a.createdAt);
    const backupsToDelete = new Map<string, BackupFile>();

    if (maxAgeMs)
      for (const backup of sorted)
        if (this.isBackupExpired({ createdAt: backup.createdAt, maxAgeMs }))
          backupsToDelete.set(backup.id, backup);

    if (maxBackups)
      for (const backup of sorted.slice(maxBackups))
        backupsToDelete.set(backup.id, backup);

    for (const backup of backupsToDelete.values()) {
      const deleted = await this.delete({
        providerType,
        fileId: backup.id,
      });
      if (!deleted.success) return deleted;
    }

    return { success: true };
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
      return {
        success: false,
        error: deleted.error ?? "Could not delete backup.",
      };

    return { success: true };
  }

  private async getConfig(
    providerType: BackupProviderType,
  ): Promise<BackupResponse<BackupConfig>> {
    const config =
      await StorageService.backupConfigs.getByProvider(providerType);

    if (!config.success || !config.data)
      return {
        success: false,
        error: config.error ?? `No backup config found for ${providerType}.`,
      };

    return { success: true, data: config.data };
  }

  private isBackupExpired(backup: { createdAt: number; maxAgeMs: number }) {
    return Date.now() - backup.createdAt > backup.maxAgeMs;
  }
}
