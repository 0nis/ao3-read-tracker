import { BackupProviderRegistry } from "./registry";
import { BackupRuntimeProxy } from ".././proxy";
import {
  backupFailure,
  requireBackupData,
  backupSuccess,
} from "../../shared/result";
import { BackupResponse, BackupTarget } from "../../shared/types";

import { StorageService } from "../../../storage/storage";
import { BackupProviderType } from "../../../../enums/backups";
import { BackupConfig } from "../../../../types/backups";

export type BackupProviderContext = {
  providerType: BackupProviderType;
  proxy: BackupRuntimeProxy;
  config: BackupConfig;
  target: BackupTarget;
};

export class BackupContextResolver {
  constructor(private readonly providers: BackupProviderRegistry) {}

  async resolve(
    providerType: BackupProviderType,
  ): Promise<BackupResponse<BackupProviderContext>> {
    const proxy = this.providers.getProxy(providerType);

    const isAvailable = await proxy.isAvailable();
    if (!isAvailable) {
      return backupFailure(
        `Backup provider is not available: ${providerType}.`,
      );
    }

    const configResult = await this.getConfig(providerType);
    if (!configResult.success) return configResult;

    const targetResult = requireBackupData(
      await proxy.getTarget(configResult.data),
      `Could not get backup target for ${providerType}.`,
    );
    if (!targetResult.success) return targetResult;

    return backupSuccess({
      providerType,
      proxy,
      config: configResult.data,
      target: targetResult.data,
    });
  }

  private async getConfig(
    providerType: BackupProviderType,
  ): Promise<BackupResponse<BackupConfig>> {
    const config =
      await StorageService.backupConfigs.getByProvider(providerType);

    return requireBackupData(
      config,
      `No backup config found for ${providerType}.`,
    );
  }
}
