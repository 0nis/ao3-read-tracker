import { BackupProviderType } from "../../../enums/backups";
import {
  BackupFile,
  BackupProviderCapabilities,
  BackupTarget,
  BackupUploadInput,
  BackupResponse,
} from "../shared/types";
import { BackupConfig } from "../../../types/backups";

export interface BackupHandler {
  readonly provider: BackupProviderType;
  readonly capabilities: BackupProviderCapabilities;

  /** Checks whether this provider can currently be used. E.g., has valid access token. */
  isAvailable(): Promise<boolean>;

  /** Gets or creates the provider's backup target. */
  getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>>;

  /** Uploads a file to the provider's backup target. */
  upload(input: BackupUploadInput): Promise<BackupResponse<BackupFile>>;

  /** Lists the files in the provider's backup target. */
  list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>>;

  /** Deletes a file from the provider's backup target. */
  delete(fileId: string): Promise<BackupResponse<void>>;

  /** Deletes the entire backup target, including all files. */
  clear(target: BackupTarget): Promise<BackupResponse<void>>;
}
