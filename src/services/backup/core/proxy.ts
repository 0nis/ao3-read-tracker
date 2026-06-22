import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";
import {
  BackupFile,
  BackupResponse,
  BackupTarget,
  BackupDirectUploadInput,
  BackupStartUploadInput,
  BackupUploadChunkInput,
} from "../shared/types";
import { BackupMessageType } from "../shared/enums";
import {
  BackupClearResponse,
  BackupDeleteResponse,
  BackupGetTargetResponse,
  BackupIsAvailableResponse,
  BackupListResponse,
  BackupDirectUploadResponse,
  BackupStartUploadResponse,
  BackupUploadChunkResponse,
} from "../shared/messages";
import { sendRuntimeMessage } from "../../../utils/runtime";

export class BackupRuntimeProxy {
  constructor(private readonly provider: BackupProviderType) {}

  async isAvailable(): Promise<boolean> {
    const response = await sendRuntimeMessage<BackupIsAvailableResponse>({
      isBackupMessage: true,
      type: BackupMessageType.IS_AVAILABLE,
      provider: this.provider,
    });

    if (!response.success) throw new Error(String(response.error));

    return response.data ?? false;
  }

  async getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>> {
    return await sendRuntimeMessage<BackupGetTargetResponse>({
      isBackupMessage: true,
      type: BackupMessageType.GET_TARGET,
      provider: this.provider,
      config,
    });
  }

  async directUpload(
    input: BackupDirectUploadInput,
  ): Promise<BackupResponse<BackupFile>> {
    return await sendRuntimeMessage<BackupDirectUploadResponse>({
      isBackupMessage: true,
      type: BackupMessageType.DIRECT_UPLOAD,
      provider: this.provider,
      input,
    });
  }

  async startUpload(
    input: BackupStartUploadInput,
  ): Promise<BackupStartUploadResponse> {
    return await sendRuntimeMessage<BackupStartUploadResponse>({
      isBackupMessage: true,
      type: BackupMessageType.START_UPLOAD,
      provider: this.provider,
      input,
    });
  }

  async uploadChunk(
    input: BackupUploadChunkInput,
  ): Promise<BackupUploadChunkResponse> {
    return await sendRuntimeMessage<BackupUploadChunkResponse>({
      isBackupMessage: true,
      type: BackupMessageType.UPLOAD_CHUNK,
      provider: this.provider,
      input,
    });
  }

  async list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>> {
    return await sendRuntimeMessage<BackupListResponse>({
      isBackupMessage: true,
      type: BackupMessageType.LIST,
      provider: this.provider,
      target,
    });
  }

  async delete(fileId: string): Promise<BackupResponse<void>> {
    return await sendRuntimeMessage<BackupDeleteResponse>({
      isBackupMessage: true,
      type: BackupMessageType.DELETE,
      provider: this.provider,
      fileId,
    });
  }

  async clear(target: BackupTarget): Promise<BackupResponse<void>> {
    return await sendRuntimeMessage<BackupClearResponse>({
      isBackupMessage: true,
      type: BackupMessageType.CLEAR,
      provider: this.provider,
      target,
    });
  }
}
