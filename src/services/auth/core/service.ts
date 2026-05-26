import { AuthRuntimeProxy } from "./proxy";
import { getAuthProviderConfig } from "./config";

import { AuthProviderType } from "../shared/enums";
import { DeviceFlowStatus } from "../oauth/device/enums";
import { DeviceFlowStartResponse } from "../oauth/device/types";

import { backupAuthSync } from "../../backup/auth/sync";
import { BACKUP_AUTH_PROVIDER_MAP } from "../../backup/auth/config";

export class AuthService {
  private readonly proxies = new Map<AuthProviderType, AuthRuntimeProxy>();

  private getProxy(provider: AuthProviderType): AuthRuntimeProxy {
    let proxy = this.proxies.get(provider);

    if (!proxy) {
      proxy = new AuthRuntimeProxy(provider);
      this.proxies.set(provider, proxy);
    }

    return proxy;
  }

  /**
   * Starts a device flow for the given provider.
   * After starting the flow, use `pollDeviceFlow` to poll the device flow status.
   *
   * @param provider The provider to start
   * @returns If ok, the verification URL, user code, and information needed to start polling
   */
  async startDeviceFlow(
    provider: AuthProviderType,
  ): Promise<DeviceFlowStartResponse> {
    const config = getAuthProviderConfig(provider);

    if (!config.supportsDeviceFlow)
      throw new Error(`Provider does not support device flow: ${provider}`);

    return this.getProxy(provider).startDeviceFlow();
  }

  /**
   * Polls the device flow status every `interval` seconds until `expiresIn` seconds have passed.
   * Use `startDeviceFlow` before polling.
   *
   * @param provider The provider to poll
   * @param expiresIn The number of seconds before the device flow expires
   * @param interval The number of seconds between each poll
   * @returns Device flow status: `COMPLETE` or `EXPIRED`
   */
  async pollDeviceFlow(
    provider: AuthProviderType,
    expiresIn: number,
    interval: number,
  ): Promise<DeviceFlowStatus> {
    const config = getAuthProviderConfig(provider);

    if (!config.supportsDeviceFlow)
      throw new Error(`Provider does not support device flow: ${provider}`);

    const proxy = this.getProxy(provider);

    const expiresAt = Date.now() + expiresIn * 1000;
    const pollDelayMs = interval * 1000;

    while (Date.now() < expiresAt) {
      await this.sleep(pollDelayMs);

      const status = await proxy.pollDeviceFlow();

      if (status === DeviceFlowStatus.COMPLETE) {
        const backupProvider = BACKUP_AUTH_PROVIDER_MAP[provider];
        if (backupProvider) await backupAuthSync.markConnected(backupProvider);

        return DeviceFlowStatus.COMPLETE;
      }
    }

    return DeviceFlowStatus.EXPIRED;
  }

  /**
   * Checks if the user is authenticated for the given provider.
   *
   * @param provider The provider to check
   * @returns True if the user is authenticated, false otherwise
   */
  async isAuthenticated(provider: AuthProviderType): Promise<boolean> {
    return this.getProxy(provider).isAuthenticated();
  }

  /**
   * Disconnects the user from the given provider.
   *
   * @param provider The provider to disconnect
   */
  async disconnect(provider: AuthProviderType): Promise<void> {
    await this.getProxy(provider).disconnect();

    const backupProvider = BACKUP_AUTH_PROVIDER_MAP[provider];
    if (backupProvider)
      await backupAuthSync.markDisconnected(BACKUP_AUTH_PROVIDER_MAP[provider]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
