import { getFullExtensionName } from "../../../../shared/extension/manifest";

export const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3";

export const GOOGLE_DRIVE_UPLOAD_BASE_URL =
  "https://www.googleapis.com/upload/drive/v3";

export const GOOGLE_DRIVE_BACKUP_FOLDER_NAME = `${getFullExtensionName()} Backups`;

export const GOOGLE_DRIVE_FOLDER_MIME_TYPE =
  "application/vnd.google-apps.folder";

export const GOOGLE_DRIVE_FILE_FIELDS =
  "id,name,mimeType,createdTime,modifiedTime,size,webViewLink,appProperties,trashed";

export const GOOGLE_DRIVE_BACKUP_APP_PROPERTIES = {
  ao3rt: "true",
  ao3rtKind: "backup",
};

export const GOOGLE_DRIVE_BACKUP_FOLDER_APP_PROPERTIES = {
  ao3rt: "true",
  ao3rtKind: "backup-folder",
};
