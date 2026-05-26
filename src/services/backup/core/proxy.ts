import { BackupProviderType } from "../../../enums/backups";
import { BackupConfig } from "../../../types/backups";
import {
  BackupFile,
  BackupResponse,
  BackupTarget,
  BackupUploadInput,
} from "../shared/types";
import { BackupMessageType } from "../shared/enums";
import {
  BackupDeleteResponse,
  BackupGetTargetResponse,
  BackupIsAvailableResponse,
  BackupListResponse,
  BackupUploadResponse,
} from "../shared/messages";
import { sendRuntimeMessage } from "../../../utils/runtime";

export class BackupRuntimeProxy {
  constructor(private readonly provider: BackupProviderType) {}

  async isAvailable(): Promise<boolean> {
    const response = await sendRuntimeMessage<BackupIsAvailableResponse>({
      type: BackupMessageType.IS_AVAILABLE,
      provider: this.provider,
    });

    if (!response.success) throw new Error(String(response.error));

    return response.data ?? false;
  }

  async getTarget(config: BackupConfig): Promise<BackupResponse<BackupTarget>> {
    return await sendRuntimeMessage<BackupGetTargetResponse>({
      type: BackupMessageType.GET_TARGET,
      provider: this.provider,
      config,
    });
  }

  async upload(input: BackupUploadInput): Promise<BackupResponse<BackupFile>> {
    return await sendRuntimeMessage<BackupUploadResponse>({
      type: BackupMessageType.UPLOAD,
      provider: this.provider,
      input,
    });
  }

  async list(target: BackupTarget): Promise<BackupResponse<BackupFile[]>> {
    return await sendRuntimeMessage<BackupListResponse>({
      type: BackupMessageType.LIST,
      provider: this.provider,
      target,
    });
  }

  async delete(fileId: string): Promise<BackupResponse<void>> {
    return await sendRuntimeMessage<BackupDeleteResponse>({
      type: BackupMessageType.DELETE,
      provider: this.provider,
      fileId,
    });
  }
}
