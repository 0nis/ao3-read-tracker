import { BackupProviderType } from "../enums/backups";

export interface BackupConfig {
  // ┍-------------------┑
  // | Provider Settings |
  // ┕-------------------┙

  provider: BackupProviderType;

  /**
   * Whether the user wants automatic backups for this provider.
   * This may remain true even if auth is currently missing.
   */
  enabled: boolean;

  // ┍---------------------┑
  // | Connection Settings |
  // ┕---------------------┙

  /** Whether this provider was successfully connected at least once */
  wasConnected?: boolean;

  /** Whether the extension currently believes auth is available */
  connected?: boolean;

  /** Timestamp of the last successful connection */
  connectedAt?: number;

  /** Timestamp of the last successful disconnection */
  disconnectedAt?: number;

  // ┍-----------------┑
  // | Backup Settings |
  // ┕-----------------┙

  /** Folder ID or path to the root of the backup folder */
  remoteTarget?: string;

  /** Minimum number of hours between backups. Checked every extension reload */
  intervalHours?: number;

  /** Maximum number of backups to keep in the cloud */
  maxBackups?: number;

  /** Timestamp of the last successful backup */
  lastBackedUpAt?: number;
}
