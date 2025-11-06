import { db } from "./db";
import { Table } from "dexie";

export class BaseData<T extends { id: string }> {
  constructor(private readonly table: Table<T, string>) {}

  async getAll(): Promise<Record<string, T>> {
    const records = await this.table.toArray();
    return Object.fromEntries(records.map((r) => [r.id, r]));
  }

  async getByIds(ids: string[]): Promise<Record<string, T>> {
    const found = await this.table.bulkGet(ids);
    return Object.fromEntries(found.filter(Boolean).map((r) => [r!.id, r!]));
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.table.get(id);
    return !!result;
  }

  async put(item: T): Promise<void> {
    await this.table.put(item);
  }

  async bulkPut(items: T[]): Promise<void> {
    await this.table.bulkPut(items);
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }

  async replaceAll(items: T[]): Promise<void> {
    await db.transaction("rw", this.table, async () => {
      await this.table.clear();
      await this.table.bulkPut(items);
    });
  }
}
