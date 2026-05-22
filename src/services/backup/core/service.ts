import { ExportOptions } from "dexie-export-import";

import { backupProviderRegistry } from "../providers/base/registry";
import { BackupProvider } from "../providers/base/provider";
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
  async create(
    providerType: BackupProviderType,
    exportOptions: ExportOptions = {},
  ): Promise<BackupResponse<BackupCreateResult>> {
    const provider = backupProviderRegistry.get(providerType);

    const isAvailable = await provider.isAvailable();
    if (!isAvailable)
      return {
        success: false,
        error: `Backup provider is not available: ${providerType}`,
      };

    const configResult = await this.getConfig(providerType);
    if (!configResult.success || !configResult.data)
      return {
        success: false,
        error: configResult.error ?? "Could not load backup config.",
      };
    const config = configResult.data;

    const target = await provider.getTarget(config);
    if (!target.success || !target.data)
      return {
        success: false,
        error: target.error ?? "Could not get backup target.",
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

    const uploaded = await provider.upload({
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
        error: uploaded.error ?? "Could not upload backup.",
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
      provider,
      target: target.data,
      maxBackups: config.maxBackups,
      maxAge: config.maxAge,
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
    provider,
    target,
    maxBackups,
    maxAge,
  }: {
    provider: BackupProvider;
    target: BackupTarget;
    maxBackups?: number;
    maxAge?: number;
  }): Promise<BackupResponse<void>> {
    if (
      (!maxBackups && !maxAge) ||
      (maxAge && maxAge <= 0) ||
      (maxBackups && maxBackups <= 0)
    )
      return { success: true };

    const backups = await provider.list(target);
    if (!backups.success || !backups.data)
      return {
        success: false,
        error: backups.error ?? "Could not list backups for pruning.",
      };

    const sorted = [...backups.data].sort((a, b) => b.createdAt - a.createdAt);

    const backupsToDelete: BackupFile[] = [];

    if (maxAge)
      backupsToDelete.push(
        ...sorted.filter((backup) =>
          this.isBackupExpired({
            createdAt: backup.createdAt,
            maxAge,
          }),
        ),
      );

    if (maxBackups) backupsToDelete.push(...sorted.slice(maxBackups));

    for (const backup of backupsToDelete)
      await this.delete({
        provider,
        fileId: backup.id,
      });

    return { success: true };
  }

  async delete({
    provider,
    fileId,
  }: {
    provider: BackupProvider;
    fileId: string;
  }): Promise<BackupResponse<void>> {
    const deleted = await provider.delete(fileId);

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

    return config;
  }

  private isBackupExpired(backup: { createdAt: number; maxAge: number }) {
    return Date.now() - backup.createdAt > backup.maxAge;
  }
}
