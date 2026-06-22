import { BackupResponse } from "../shared/types";
import { StorageResult } from "../../../types/storage";

export function backupSuccess<T>(data: T): BackupResponse<T> {
  return { success: true, data };
}

export function backupSuccessVoid(): BackupResponse<void> {
  return { success: true, data: undefined };
}

export function backupFailure<T = never>(error: unknown): BackupResponse<T> {
  return { success: false, error };
}

export function requireBackupData<T>(
  response: BackupResponse<T> | StorageResult<T>,
  fallbackError: string,
): BackupResponse<NonNullable<T>> {
  if (
    !response.success ||
    response.data === undefined ||
    response.data === null
  ) {
    return backupFailure(
      !response.success ? (response.error ?? fallbackError) : fallbackError,
    );
  }

  return backupSuccess(response.data as NonNullable<T>);
}
