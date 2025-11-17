import { Table } from "dexie";

export class SettingsData<T extends { id: string }> {
  constructor(
    private readonly table: Table<T, string>,
    private readonly settingsId: string
  ) {}

  async get(): Promise<T | undefined> {
    return await this.table.get(this.settingsId);
  }

  async update(settings: Partial<T>): Promise<void> {
    const current = await this.get();
    await this.table.put({
      ...current,
      ...settings,
      id: this.settingsId,
    } as T);
  }

  async set(settings: T): Promise<void> {
    await this.table.put({ ...settings, id: this.settingsId });
  }

  async reset(defaults: T): Promise<void> {
    await this.table.put({ ...defaults, id: this.settingsId });
  }
}
