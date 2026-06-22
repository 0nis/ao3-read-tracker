import { BackupProviderType } from "../../../../enums/backups";
import { BackupFile } from "../../shared/types";
import { GoogleDriveFile } from "./types";

export function toBackupFile(file: GoogleDriveFile): BackupFile {
  return {
    id: file.id,
    name: file.name,
    createdAt: file.createdTime
      ? new Date(file.createdTime).getTime()
      : Date.now(),
    modifiedAt: file.modifiedTime
      ? new Date(file.modifiedTime).getTime()
      : undefined,
    sizeBytes: file.size ? Number(file.size) : undefined,
    url: file.webViewLink,
    provider: BackupProviderType.GOOGLE_DRIVE,
  };
}
