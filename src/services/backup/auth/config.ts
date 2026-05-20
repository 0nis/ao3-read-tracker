import { AuthProvider } from "../../auth/shared/enums";
import { BackupProviderType } from "../../../enums/backups";

export const BACKUP_PROVIDER_AUTH_MAP: {
  [K in BackupProviderType]: AuthProvider;
} = {
  [BackupProviderType.GOOGLE_DRIVE]: AuthProvider.GOOGLE,
};

export const BACKUP_AUTH_PROVIDER_MAP: {
  [K in AuthProvider]: BackupProviderType;
} = {
  [AuthProvider.GOOGLE]: BackupProviderType.GOOGLE_DRIVE,
};
