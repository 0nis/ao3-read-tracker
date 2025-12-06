/**
 * Implemented by caches that load data asynchronously.
 * Subclasses must implement {@link load} to load the data.
 *
 * @template T The type of the cached data to load
 */
export abstract class AsyncCache<T> {
  protected cache: T | null = null;
  protected fetchPromise: Promise<T> | null = null;

  /**
   * Subclasses must implement this to load the data
   * if cache is empty.
   */
  protected abstract load(): Promise<T>;

  /**
   * Returns the current cached value
   * - If the cache is empty, it loads it using {@link load}
   * - If multiple concurrent calls are made, it memoizes the first one.
   */
  async get(): Promise<T> {
    if (this.cache) return this.cache;
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = this.load().then((data) => {
      this.cache = data;
      this.fetchPromise = null;
      return data;
    });

    return this.fetchPromise;
  }

  /**
   * Updates the cache value.
   * Does not automatically persist the value to storage.
   */
  update(value: T): void {
    this.cache = value;
  }

  /**
   * Clears the in-memory cache.
   * Subsequent calls to {@link get} reload the value.
   */
  clear(): void {
    this.cache = null;
    this.fetchPromise = null;
  }
}
