import { BackupProviderType, RemoteTargetKind } from "../../../enums/backups";

export interface BackupTarget {
  id: string;
  kind: RemoteTargetKind;
  name?: string;
}

export interface BackupFile {
  provider: BackupProviderType;
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
  createdAt: number;
}

export interface BackupDirectUploadInput extends BackupUploadInput {
  content: string;
}

export interface BackupStartUploadInput extends BackupUploadInput {
  sizeBytes: number;
}

export interface BackupUploadChunkInput {
  uploadId: string;
  chunkBase64: string;
  startByte: number;
  endByteExclusive: number;
  totalBytes: number;
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

export type BackupResponse<T = void> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error?: Error | string | unknown;
    };
