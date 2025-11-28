import { LoaderType } from "../../enums/ui";
import { StorageResult } from "../../types/results";
import { reportExtensionFailure } from "../ui/dialogs";
import { createFlashNotice } from "../ui/form";
import { createButtonLoader, withLoadingState } from "../ui/loaders";

export interface StorageReadOptions<T> {
  errorMsg?: string;
  fallback?: T;
  allowUndefined?: boolean;
}

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
  options: StorageReadOptions<T>
): Promise<T> {
  const result = await op;
  const {
    errorMsg = "An error occurred while reading from storage.",
    fallback,
    allowUndefined = false,
  } = options;

  if (result.success) {
    if (result.data !== undefined || allowUndefined) {
      return result.data as T;
    }
  }

  reportExtensionFailure(errorMsg, result.error);
  return fallback as T;
}

export interface StorageWriteOptions {
  successMsg?: string;
  errorMsg?: string;
  loadingEl?: HTMLElement;
  enforceMinDelay?: boolean;
  onSuccess?: (message: string) => void;
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
  options: StorageWriteOptions
): Promise<void> {
  const {
    successMsg = "Changes saved successfully.",
    errorMsg = "An error occurred while saving changes.",
    loadingEl,
    enforceMinDelay = false,
    onSuccess = createFlashNotice,
  } = options;

  const controller = createButtonLoader(
    loadingEl as HTMLButtonElement,
    LoaderType.SPINNER
  );
  const result = await withLoadingState(controller, () => op, {
    enforceMinDelay,
    minDelayMs: 300,
  });

  if (result.success) {
    onSuccess(successMsg);
    return Promise.resolve();
  } else {
    reportExtensionFailure(errorMsg, result.error);
    return Promise.reject();
  }
}
