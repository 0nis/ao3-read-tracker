import { Table } from "dexie";

export class SymbolsData<T extends { id: string }> {
  constructor(private readonly table: Table<T, string>) {}

  async get(): Promise<T[]> {
    return await this.table.toArray();
  }

  async set(items: T[]): Promise<void> {
    await this.table.clear();
    await this.table.bulkPut(items);
  }
}
