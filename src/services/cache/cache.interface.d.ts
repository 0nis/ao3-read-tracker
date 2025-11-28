export interface ICache<T> {
  /**
   * Returns the current cached value.
   * If the cache is empty, it should load it.
   */
  get(): Promise<T>;

  /**
   * Updates the cache value
   */
  update(value: T): void;

  /**
   * Clears the in-memory cache.
   */
  clear(): void;
}
