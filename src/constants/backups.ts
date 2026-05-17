import { BackupProviderType } from "../enums/backups";
import { BackupConfig } from "../types/backups";

export const DEFAULT_BACKUP_CONFIGS: BackupConfig[] = [
  {
    provider: BackupProviderType.GOOGLE_DRIVE,
    enabled: false,
  },
];
