import { BackupHandler } from "../providers/base";
import { BackupProviderType } from "../../../enums/backups";

import { GoogleBackupHandler } from "../providers/google-drive/handler";

type BackupHandlerFactory = () => BackupHandler;

export class BackupHandlerRegistry {
  private readonly factories: Partial<
    Record<BackupProviderType, BackupHandlerFactory>
  > = {
    [BackupProviderType.GOOGLE_DRIVE]: () => new GoogleBackupHandler(),
  };

  private readonly handlers = new Map<BackupProviderType, BackupHandler>();

  get(provider: BackupProviderType): BackupHandler {
    const existing = this.handlers.get(provider);
    if (existing) return existing;

    const factory = this.factories[provider];
    if (!factory)
      throw new Error(`Unsupported backup provider: ${String(provider)}`);

    const handler = factory();
    this.handlers.set(provider, handler);

    return handler;
  }
}

export const backupHandlerRegistry = new BackupHandlerRegistry();
