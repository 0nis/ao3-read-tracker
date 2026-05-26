import { AuthProviderType } from "../../auth/shared/enums";
import { BackupProviderType } from "../../../enums/backups";

export const BACKUP_PROVIDER_AUTH_MAP: {
  [K in BackupProviderType]: AuthProviderType;
} = {
  [BackupProviderType.GOOGLE_DRIVE]: AuthProviderType.GOOGLE,
};

export const BACKUP_AUTH_PROVIDER_MAP: {
  [K in AuthProviderType]: BackupProviderType;
} = {
  [AuthProviderType.GOOGLE]: BackupProviderType.GOOGLE_DRIVE,
};
