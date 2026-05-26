import { BackupHandler } from "../providers/base";
import { BackupProviderType } from "../../../enums/backups";

type BackupHandlerFactory = () => BackupHandler;

export class BackupHandlerRegistry {
  private readonly factories: Partial<
    Record<BackupProviderType, BackupHandlerFactory>
  > = {};

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
