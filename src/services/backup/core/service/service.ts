import { ExportOptions } from "dexie-export-import";

import { BackupProviderRegistry } from "./registry";
import { BackupContextResolver } from "./context";
import { BackupUploader } from "./uploader";
import { BackupPruner } from "./pruner";

import {
  backupFailure,
  requireBackupData,
  backupSuccess,
  backupSuccessVoid,
} from "../../shared/result";
import {
  BackupCreateResult,
  BackupFile,
  BackupResponse,
  BackupTarget,
} from "../../shared/types";

import { IoService } from "../../../storage/io";
import { StorageService } from "../../../storage/storage";

import { getBackupFileName } from "../../../../shared/string";
import { warn } from "../../../../shared/extension/logger";
import { daysToMs } from "../../../../utils/date";
import { BackupProviderType } from "../../../../enums/backups";

export class BackupService {
  constructor(
    private readonly providers = new BackupProviderRegistry(),
    private readonly uploader = new BackupUploader(),
  ) {}

  private readonly context = new BackupContextResolver(this.providers);
  private readonly pruner = new BackupPruner(this.providers);

  async list(
    providerType: BackupProviderType,
  ): Promise<BackupResponse<BackupFile[]>> {
    const context = await this.context.resolve(providerType);
    if (!context.success) return context;

    return await context.data.proxy.list(context.data.target);
  }

  async create(
    providerType: BackupProviderType,
    exportOptions: ExportOptions = {},
  ): Promise<BackupResponse<BackupCreateResult>> {
    const context = await this.context.resolve(providerType);
    if (!context.success) return context;

    const { proxy, config, target } = context.data;

    const exported = requireBackupData(
      await IoService.export(exportOptions),
      "Could not export database.",
    );

    if (!exported.success) return exported;

    const createdAt = Date.now();

    const uploaded = requireBackupData(
      await this.uploader.upload({
        proxy,
        blob: exported.data,
        settings: {
          fileName: getBackupFileName({
            datetime: createdAt,
            type: "backup",
            fileType: "json",
          }),
          target,
          createdAt,
        },
      }),
      "Could not upload backup.",
    );

    if (!uploaded.success) return uploaded;

    await this.markConfigAsBackedUp({
      providerType,
      target,
      createdAt,
    });

    const pruneResult = await this.pruner.prune({
      providerType,
      target,
      maxBackups: config.maxBackups,
      maxAgeMs: config.maxAgeDays ? daysToMs(config.maxAgeDays) : undefined,
    });

    if (!pruneResult.success)
      warn(
        `Backup was created, but pruning failed for provider ${providerType}:`,
        pruneResult.error,
      );

    return backupSuccess({
      file: uploaded.data,
    });
  }

  async prune(input: {
    providerType: BackupProviderType;
    target: BackupTarget;
    maxBackups?: number;
    maxAgeMs?: number;
  }): Promise<BackupResponse<void>> {
    return await this.pruner.prune(input);
  }

  async delete({
    providerType,
    fileId,
  }: {
    providerType: BackupProviderType;
    fileId: string;
  }): Promise<BackupResponse<void>> {
    const deleted = await this.providers.getProxy(providerType).delete(fileId);

    if (!deleted.success)
      return backupFailure(deleted.error ?? "Could not delete backup.");

    return backupSuccessVoid();
  }

  async clear({
    providerType,
    target,
  }: {
    providerType: BackupProviderType;
    target: BackupTarget;
  }): Promise<BackupResponse<void>> {
    const cleared = await this.providers.getProxy(providerType).clear(target);

    if (!cleared.success)
      return backupFailure(cleared.error ?? "Could not clear backups.");

    await StorageService.backupConfigs.update(providerType, {
      remoteTarget: undefined,
      remoteTargetName: undefined,
      remoteTargetKind: undefined,
    });

    return backupSuccessVoid();
  }

  private async markConfigAsBackedUp({
    providerType,
    target,
    createdAt,
  }: {
    providerType: BackupProviderType;
    target: BackupTarget;
    createdAt: number;
  }): Promise<void> {
    await StorageService.backupConfigs.update(providerType, {
      wasConnected: true,
      connected: true,
      lastBackedUpAt: createdAt,
      remoteTarget: target.id,
      remoteTargetName: target.name,
      remoteTargetKind: target.kind,
    });
  }
}
