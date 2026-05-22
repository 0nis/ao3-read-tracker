import { BackupProviderType, RemoteTargetKind } from "../../../enums/backups";

export interface BackupTarget {
  id: string;
  kind: RemoteTargetKind;
  name?: string;
}

export interface BackupFile {
  id: string;
  name: string;
  createdAt: number;
  modifiedAt?: number;
  sizeBytes?: number;
  url?: string;
}

export interface BackupUploadInput {
  target: BackupTarget;
  fileName: string;
  mimeType: string;
  content: string;
  createdAt: number;
}

export interface BackupCreateOptions {
  provider: BackupProviderType;
}

export interface BackupCreateResult {
  file: BackupFile;
}

export interface BackupProviderCapabilities {
  canTrash: boolean;
  canUseAppFolder: boolean;
  canUseUserFolder: boolean;
}

export type BackupResponse<T = void> = {
  data?: T;
  error?: Error | string | unknown;
  success: boolean;
};
