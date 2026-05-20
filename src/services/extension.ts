function getLastRuntimeError(): Error | null {
  const err = chrome.runtime.lastError;
  return err?.message ? new Error(err.message) : null;
}

export class ExtensionStorageService {
  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        const err = getLastRuntimeError();

        if (err) {
          reject(err);
          return;
        }

        resolve((result[key] as T | undefined) ?? null);
      });
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        const err = getLastRuntimeError();

        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        const err = getLastRuntimeError();

        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}

export const extensionStorage = new ExtensionStorageService();
