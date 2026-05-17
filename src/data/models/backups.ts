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
    if (!current) throw new Error(`Backup provider ${provider} not found`);
    await this.table.put({ ...current, ...cfg });
  }
}
