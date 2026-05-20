import { StorageService } from "../../storage/storage";
import { BackupProviderType } from "../../../enums/backups";

export class BackupAuthSyncService {
  async markConnected(provider: BackupProviderType): Promise<void> {
    await StorageService.backupConfigs.update(provider, {
      wasConnected: true,
      connected: true,
      connectedAt: Date.now(),
      disconnectedAt: undefined,
    });
  }

  async markDisconnected(provider: BackupProviderType): Promise<void> {
    await StorageService.backupConfigs.update(provider, {
      connected: false,
      disconnectedAt: Date.now(),
    });
  }

  async markAuthMissing(provider: BackupProviderType): Promise<void> {
    await StorageService.backupConfigs.update(provider, {
      connected: false,
    });
  }
}

export const backupAuthSync = new BackupAuthSyncService();
