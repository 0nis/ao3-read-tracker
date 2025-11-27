import { Table } from "dexie";

export class SymbolsData<T extends { id: string }> {
  constructor(private readonly table: Table<T, string>) {}

  async get(): Promise<Record<string, T>> {
    const records = await this.table.toArray();
    return Object.fromEntries(records.map((r) => [r.id, r]));
  }

  async set(items: T[]): Promise<void> {
    await this.table.clear();
    await this.table.bulkPut(items);
  }
}
