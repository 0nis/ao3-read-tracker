export const BACKUP_MIME_TYPE = "application/json";

export const MAX_DIRECT_BACKUP_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MiB, still safely passes through runtime messages at once
export const CHUNK_SIZE_BYTES = 1024 * 1024; // 1 MiB, multiple of 256 KiB

export const DEFAULT_MAX_BACKUPS = 5;
