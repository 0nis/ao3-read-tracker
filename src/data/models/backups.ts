import { Table } from "dexie";
import { BackupConfig } from "../../types/backups";
import { BackupProviderType } from "../../enums/backups";

export class BackupsData<T extends BackupConfig> {
  constructor(private readonly table: Table<T, string>) {}

  async get(): Promise<Partial<Record<BackupProviderType, T>>> {
    const records = await this.table.toArray();
    return Object.fromEntries(records.map((r) => [r.provider, r]));
  }

  async getByProvider(provider: BackupProviderType): Promise<T | undefined> {
    return await this.table.get(provider);
  }

  async update(provider: BackupProviderType, cfg: Partial<T>): Promise<void> {
    const current = await this.getByProvider(provider);
    if (!current) {
      await this.create({
        ...cfg,
        enabled: cfg.enabled || false,
        provider,
      } as T);
      return;
    }
    await this.table.put({ ...current, ...cfg, provider });
  }

  async create(cfg: T): Promise<void> {
    if (!cfg.provider)
      throw new Error("Cannot create backup config without provider.");

    await this.table.add(cfg);
  }

  async delete(provider: BackupProviderType): Promise<void> {
    await this.table.delete(provider);
  }
}
