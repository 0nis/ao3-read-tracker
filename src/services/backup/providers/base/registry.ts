import { BackupHandler } from "./handler";
import { BackupProviderType } from "../../../../enums/backups";

class BackupProviderRegistry {
  private readonly providers = new Map<BackupProviderType, BackupHandler>();

  register(provider: BackupHandler): void {
    this.providers.set(provider.provider, provider);
  }

  get(providerType: BackupProviderType): BackupHandler {
    const provider = this.providers.get(providerType);

    if (!provider)
      throw new Error(`Backup provider is not registered: ${providerType}`);

    return provider;
  }
}

export const backupProviderRegistry = new BackupProviderRegistry();
