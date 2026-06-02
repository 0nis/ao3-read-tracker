import { BackupMessageType } from "./enums";
import {
  BackupFile,
  BackupResponse,
  BackupTarget,
  BackupUploadInput,
} from "./types";

import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";

export type BackupMessage =
  | BackupIsAvailableMessage
  | BackupGetTargetMessage
  | BackupUploadMessage
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

export interface BackupUploadMessage extends BackupBaseMessage {
  type: BackupMessageType.UPLOAD;
  input: BackupUploadInput;
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
export type BackupUploadResponse = BackupResponse<BackupFile>;
export type BackupListResponse = BackupResponse<BackupFile[]>;
export type BackupDeleteResponse = BackupResponse<void>;
export type BackupClearResponse = BackupResponse<void>;
