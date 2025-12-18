import { Table } from "dexie";

export class SymbolsData<T extends { id: string }> {
  constructor(private readonly table: Table<T, string>) {}

  async get(): Promise<Record<string, T>> {
    const records = await this.table.orderBy("priority").reverse().toArray();
    return Object.fromEntries(records.map((r) => [r.id, r]));
  }

  async getById(id: string): Promise<T | undefined> {
    return await this.table.get(id);
  }

  async set(items: T[]): Promise<void> {
    await this.table.clear();
    await this.table.bulkPut(items);
  }

  async put(item: T): Promise<void> {
    await this.table.put(item);
  }
}
