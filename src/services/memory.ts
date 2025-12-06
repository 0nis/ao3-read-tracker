import { warn } from "../utils/extension";

export class LocalMemoryService {
  /** Persist a value under the given key */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      warn(`Failed to set local memory for key "${key}":`, err);
    }
  }

  /** Retrieve a value by key */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      warn(`Failed to get local memory for key "${key}":`, err);
      return null;
    }
  }

  /** Remove a specific key */
  delete(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      warn(`Failed to delete local memory for key "${key}":`, err);
    }
  }
}

export const localMemory = new LocalMemoryService();
