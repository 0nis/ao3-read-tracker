import { CLASS_PREFIX } from "../../constants/classes";
import { StorageResult } from "../../types/results";
import { reportExtensionFailure } from "../ui/dialogs";
import { createFlashNotice } from "../ui/form";

/**
 * Executes a storage read operation and handles failures with a critical error.
 * Provides a fallback value if the operation fails or returns undefined (unless `allowUndefined` is true).
 *
 * @template T The expected type of the data returned by the storage operation
 * @param op The storage operation returning a StorageResult<T>
 * @param fallback The value to return if the operation fails
 * @param errorMsg A descriptive error message for reporting failures
 * @param allowUndefined If true, allows undefined as a valid result without triggering a fallback
 * @returns The fetched data if successful, otherwise the fallback (or undefined if allowed)
 */
export async function handleStorageRead<T>(
  op: Promise<StorageResult<T>>,
  fallback: T,
  errorMsg: string,
  allowUndefined: boolean = false
): Promise<T> {
  const result = await op;

  if (result.success) {
    if (result.data !== undefined || allowUndefined) {
      return result.data as T;
    }
  }

  reportExtensionFailure(errorMsg, result.error);
  return fallback;
}

/**
 * Executes a storage write operation and provides user feedback on success or failure.
 * Displays a success flash notice if the operation succeeds, or a critical error dialog if it fails.
 *
 * @template T The type returned by the storage operation (ignored for UI purposes)
 * @param op The storage operation returning a StorageResult<T>
 * @param messages Object containing `success` and `error` messages for UI feedback
 * @param onSuccess Optional callback executed if the operation succeeds
 * @param loadingEl Optional button or element to show a loading indicator inside while the operation is pending
 */
export async function handleStorageWrite<T>(
  op: Promise<StorageResult<T>>,
  successMsg: string,
  errorMsg: string,
  loadingEl?: HTMLElement,
  enforceMinDelay: boolean = false,
  onSuccess: (message: string) => void = createFlashNotice
): Promise<void> {
  let originalContent: string | undefined;
  let promiseArray: Promise<any>[] = [];

  if (loadingEl) {
    originalContent = loadingEl.innerHTML;
    loadingEl.innerHTML = `
        <span 
            class="${CLASS_PREFIX}__loader" 
            role="status" 
            aria-label="Loading"
        />`;
    if (loadingEl instanceof HTMLButtonElement) loadingEl.disabled = true;
    if (enforceMinDelay) {
      // Minimum delay to prevent sudden UI flashes on fast operations
      promiseArray.push(new Promise((resolve) => setTimeout(resolve, 300)));
    }
  }

  try {
    const result = await Promise.all([op, ...promiseArray]).then(([r]) => r);

    if (result.success) {
      onSuccess(successMsg);
      return Promise.resolve();
    } else {
      reportExtensionFailure(errorMsg, result.error);
      return Promise.reject();
    }
  } finally {
    if (loadingEl) {
      loadingEl.innerHTML = originalContent ?? "";
      if (loadingEl instanceof HTMLButtonElement) loadingEl.disabled = false;
    }
  }
}
