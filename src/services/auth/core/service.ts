import { authProxyRegistry } from "./registry";

import { supportsDeviceFlow } from "../providers/base/proxy";
import { AuthProviderType, DeviceFlowStatus } from "../shared/enums";
import { DeviceFlowStartResponse } from "../oauth/device/types";

import { backupAuthSync } from "../../backup/auth/sync";
import { BACKUP_AUTH_PROVIDER_MAP } from "../../backup/auth/config";

export class AuthService {
  async startDeviceFlow(
    provider: AuthProviderType,
  ): Promise<DeviceFlowStartResponse> {
    const proxy = authProxyRegistry.get(provider);

    if (!supportsDeviceFlow(proxy))
      throw new Error(`Provider does not support device flow: ${provider}`);

    return proxy.startDeviceFlow();
  }

  async pollDeviceFlow(
    provider: AuthProviderType,
    expiresIn: number,
    interval: number,
  ): Promise<DeviceFlowStatus> {
    const proxy = authProxyRegistry.get(provider);

    if (!supportsDeviceFlow(proxy))
      throw new Error(`Provider does not support device flow: ${provider}`);

    const expiresAt = Date.now() + expiresIn * 1000;
    const pollDelayMs = interval * 1000;

    while (Date.now() < expiresAt) {
      await this.sleep(pollDelayMs);

      const status = await proxy.pollDeviceFlow();

      if (status === DeviceFlowStatus.COMPLETE) {
        await backupAuthSync.markConnected(BACKUP_AUTH_PROVIDER_MAP[provider]);
        return DeviceFlowStatus.COMPLETE;
      }
    }

    return DeviceFlowStatus.EXPIRED;
  }

  async isAuthenticated(provider: AuthProviderType): Promise<boolean> {
    return authProxyRegistry.get(provider).isAuthenticated();
  }

  async disconnect(provider: AuthProviderType): Promise<void> {
    await backupAuthSync.markDisconnected(BACKUP_AUTH_PROVIDER_MAP[provider]);
    return authProxyRegistry.get(provider).disconnect();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
