export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  trashed?: boolean;
  appProperties?: Record<string, string>;
}
