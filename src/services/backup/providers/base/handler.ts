import { BackupProviderType } from "../../../../enums/backups";
import {
  BackupFile,
  BackupProviderCapabilities,
  BackupTarget,
  BackupUploadInput,
  BackupResponse,
} from "../../shared/types";
import { BackupConfig } from "../../../../types/backups";

export interface BackupHandler {
  readonly provider: BackupProviderType;
  readonly capabilities: BackupProviderCapabilities;

  /** Checks whether this provider can currently be used. E.g., has valid access token. */
  isAvailable(): Promise<boolean>;

  /** Gets or creates the provider's backup target. */
  getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>>;

  upload(input: BackupUploadInput): Promise<BackupResponse<BackupFile>>;

  list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>>;

  delete(fileId: string): Promise<BackupResponse<void>>;

  getType(): BackupProviderType;
}
