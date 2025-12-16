import Dexie, { Table } from "dexie";
import { db } from "../db";
import { PaginatedParams, PaginatedResult } from "../../types/storage";

export class WorksData<T extends { id: string }> {
  constructor(private readonly table: Table<T, string>) {}

  async get(): Promise<Record<string, T>> {
    const records = await this.table.toArray();
    return Object.fromEntries(records.map((r) => [r.id, r]));
  }

  async getById(id: string): Promise<T | undefined> {
    return await this.table.get(id);
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

  /**
   * Paginate through the works in the table.
   * Uses 1-based page indexing (params *and* returns)
   */
  async paginate({
    page,
    pageSize,
    options,
    filters,
  }: PaginatedParams<T>): Promise<PaginatedResult<T>> {
    const { orderBy, reverse = false } = options || {};

    let query = this.table.orderBy(orderBy as string);

    if (reverse) query = query.reverse();

    for (const filter of filters ?? []) {
      query = query.and((item) => item[filter.field] === filter.value);
    }

    const totalItems = await this.table.count();
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const clampedPage = Math.min(Math.max(1, page), totalPages);
    const offset = (clampedPage - 1) * pageSize;

    const items = await query.offset(offset).limit(pageSize).toArray();

    return {
      items,
      page: clampedPage,
      pageSize,
      totalItems,
      totalPages,
      hasNext: clampedPage < totalPages,
      hasPrev: clampedPage > 1,
    };
  }
}
