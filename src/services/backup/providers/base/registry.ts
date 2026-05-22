import { BackupProvider } from "./provider";
import { BackupProviderType } from "../../../../enums/backups";

class BackupProviderRegistry {
  private readonly providers = new Map<BackupProviderType, BackupProvider>();

  register(provider: BackupProvider): void {
    this.providers.set(provider.provider, provider);
  }

  get(providerType: BackupProviderType): BackupProvider {
    const provider = this.providers.get(providerType);

    if (!provider)
      throw new Error(`Backup provider is not registered: ${providerType}`);

    return provider;
  }
}

export const backupProviderRegistry = new BackupProviderRegistry();
