import { db } from "../db";

export interface ExistenceCache {
  has(table: string, key: any): boolean;
}

export async function createExistenceCache(): Promise<ExistenceCache> {
  const keyCache = new Map<string, Set<any>>();

  for (const table of db.tables) {
    const keys = await table.toCollection().primaryKeys();
    keyCache.set(table.name, new Set(keys));
  }

  return {
    has(tableName: string, key: any) {
      const tableKeys = keyCache.get(tableName);
      if (!tableKeys) return false;
      return tableKeys.has(key);
    },
  };
}
