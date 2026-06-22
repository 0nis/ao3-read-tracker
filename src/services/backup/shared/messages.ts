import { BackupMessageType } from "./enums";
import {
  BackupDirectUploadInput,
  BackupFile,
  BackupResponse,
  BackupStartUploadInput,
  BackupTarget,
  BackupUploadChunkInput,
} from "./types";

import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";

export type BackupMessage =
  | BackupIsAvailableMessage
  | BackupGetTargetMessage
  | BackupDirectUploadMessage
  | BackupStartUploadMessage
  | BackupUploadChunkMessage
  | BackupListMessage
  | BackupDeleteMessage
  | BackupClearMessage;

interface BackupBaseMessage {
  isBackupMessage: true;
  type: BackupMessageType;
  provider: BackupProviderType;
}

export interface BackupIsAvailableMessage extends BackupBaseMessage {
  type: BackupMessageType.IS_AVAILABLE;
}

export interface BackupGetTargetMessage extends BackupBaseMessage {
  type: BackupMessageType.GET_TARGET;
  config: BackupConfig;
}

export interface BackupDirectUploadMessage extends BackupBaseMessage {
  type: BackupMessageType.DIRECT_UPLOAD;
  input: BackupDirectUploadInput;
}

export interface BackupStartUploadMessage extends BackupBaseMessage {
  type: BackupMessageType.START_UPLOAD;
  input: BackupStartUploadInput;
}

export interface BackupUploadChunkMessage extends BackupBaseMessage {
  type: BackupMessageType.UPLOAD_CHUNK;
  input: BackupUploadChunkInput;
}

export interface BackupListMessage extends BackupBaseMessage {
  type: BackupMessageType.LIST;
  target: BackupTarget;
}

export interface BackupDeleteMessage extends BackupBaseMessage {
  type: BackupMessageType.DELETE;
  fileId: string;
}

export interface BackupClearMessage extends BackupBaseMessage {
  type: BackupMessageType.CLEAR;
  target: BackupTarget;
}

export type BackupIsAvailableResponse = BackupResponse<boolean>;
export type BackupGetTargetResponse = BackupResponse<BackupTarget>;
export type BackupDirectUploadResponse = BackupResponse<BackupFile>;
export type BackupStartUploadResponse = BackupResponse<{ uploadId: string }>;
export type BackupUploadChunkResponse = BackupResponse<{
  done: boolean;
  file?: BackupFile;
}>;
export type BackupListResponse = BackupResponse<BackupFile[]>;
export type BackupDeleteResponse = BackupResponse<void>;
export type BackupClearResponse = BackupResponse<void>;
