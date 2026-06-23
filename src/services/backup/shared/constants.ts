import { ABBREVIATION } from "../../../constants/global";

export const BACKUP_MIME_TYPE = "application/json";

export const MAX_DIRECT_BACKUP_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MiB, still safely passes through runtime messages at once
export const CHUNK_SIZE_BYTES = 1024 * 1024; // 1 MiB, multiple of 256 KiB

export const DEFAULT_MAX_BACKUPS = 5;

export const BACKUP_LOCK_UNTIL_KEY = `${ABBREVIATION}:backup-lock-until`;
export const BACKUP_LOCK_UNTIL_MS = 1 * 60 * 1000; // 1 minute, locks automatic creation of backups until this time has passed to prevent multiple sessions from creating backups at the same time
