import { BackupProviderType } from "../enums/backups";

export interface BackupConfig {
  provider: BackupProviderType;
  enabled: boolean;
  intervalHours?: number;
  maxBackups?: number;
  lastBackedUpAt?: number;
  remoteTarget?: string;
}
