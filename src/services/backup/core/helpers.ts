import { BackupResponse } from "../shared/types";

export function requireData<T>(
  response: BackupResponse<T>,
  fallbackError: string,
): BackupResponse<T> {
  if (!response.success || response.data === undefined)
    return failure(
      !response.success ? (response.error ?? fallbackError) : fallbackError,
    );

  return success(response.data);
}

export function success<T>(data: T): BackupResponse<T> {
  return { success: true, data };
}

export function successVoid(): BackupResponse<void> {
  return { success: true };
}

export function failure<T = never>(error: unknown): BackupResponse<T> {
  return { success: false, error };
}
