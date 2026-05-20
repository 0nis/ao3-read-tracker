import { GoogleDeviceAuth } from "./auth";
import { DeviceFlowStatus } from "../../../shared/enums";
import { backupAuthSync } from "../../../../backup/auth/sync";
import { BackupProviderType } from "../../../../../enums/backups";
import { DeviceFlowStartResponse } from "../../../oauth/device/types";

export class GoogleDeviceAuthManager {
  private auth = new GoogleDeviceAuth();

  async start(): Promise<DeviceFlowStartResponse> {
    return await this.auth.startDeviceFlow();
  }

  async poll(expiresIn: number, interval: number): Promise<DeviceFlowStatus> {
    const expiresAt = Date.now() + expiresIn * 1000;
    const pollDelayMs = interval * 1000;

    while (Date.now() < expiresAt) {
      await this.sleep(pollDelayMs);

      const status = await this.auth.pollDeviceFlow();

      if (status === DeviceFlowStatus.COMPLETE) {
        await backupAuthSync.markConnected(BackupProviderType.GOOGLE_DRIVE);
        return DeviceFlowStatus.COMPLETE;
      }
    }

    return DeviceFlowStatus.EXPIRED;
  }

  async disconnect(): Promise<void> {
    await this.auth.disconnect();
    await backupAuthSync.markDisconnected(BackupProviderType.GOOGLE_DRIVE);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
