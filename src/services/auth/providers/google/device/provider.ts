import { GOOGLE_DEVICE_OAUTH_CONFIG, GOOGLE_REVOKE_URL } from "./config";

import { DeviceOAuthClient } from "../../../oauth/device/client";

import { OAuthDeviceFlowStore } from "../../../storage/oauth/device-flow";
import { OAuthTokenStore } from "../../../storage/oauth/tokens";

import { DeviceAuthProvider } from "../../../shared/provider";
import { AuthProvider, DeviceFlowStatus } from "../../../shared/enums";

import { DeviceFlowStartResponse } from "../../../oauth/device/types";
import {
  OAuthStoredState,
  OAuthTokenResponse,
} from "../../../oauth/token-types";

const REFRESH_BUFFER_MS = 60_000;
const SLOW_DOWN_INCREMENT_SECONDS = 5;

function toStoredState(
  token: OAuthTokenResponse,
  existingRefreshToken?: string,
): OAuthStoredState {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken ?? existingRefreshToken,
    expiresAt: Date.now() + token.expiresIn * 1000,
    refreshTokenExpiresAt: token.refreshTokenExpiresIn
      ? Date.now() + token.refreshTokenExpiresIn * 1000
      : undefined,
    scope: token.scope,
    tokenType: token.tokenType,
  };
}

export class GoogleDeviceAuthProvider implements DeviceAuthProvider {
  readonly provider = AuthProvider.GOOGLE;
  readonly supportsDeviceFlow = true;

  private client = new DeviceOAuthClient(GOOGLE_DEVICE_OAUTH_CONFIG);
  private tokenStore = new OAuthTokenStore(AuthProvider.GOOGLE);
  private deviceFlowStore = new OAuthDeviceFlowStore(AuthProvider.GOOGLE);

  async startDeviceFlow(): Promise<DeviceFlowStartResponse> {
    const code = await this.client.requestDeviceCode();

    await this.deviceFlowStore.set({
      provider: AuthProvider.GOOGLE,
      deviceCode: code.deviceCode,
      userCode: code.userCode,
      verificationUrl: code.verificationUrl,
      expiresAt: Date.now() + code.expiresIn * 1000,
      interval: code.interval,
    });

    return {
      ok: true,
      provider: AuthProvider.GOOGLE,
      verificationUrl: code.verificationUrl,
      userCode: code.userCode,
      expiresIn: code.expiresIn,
      interval: code.interval,
    };
  }

  async pollDeviceFlow(): Promise<DeviceFlowStatus> {
    const pending = await this.deviceFlowStore.get();

    if (!pending) {
      throw new Error("No Google authorization flow is currently pending.");
    }

    if (Date.now() >= pending.expiresAt) {
      await this.deviceFlowStore.clear();
      throw new Error(
        "The Google authorization code expired. Please start again.",
      );
    }

    const now = Date.now();
    const minimumDelayMs = pending.interval * 1000;

    if (pending.lastPollAt && now - pending.lastPollAt < minimumDelayMs) {
      return DeviceFlowStatus.PENDING;
    }

    await this.deviceFlowStore.set({
      ...pending,
      lastPollAt: now,
    });

    const result = await this.client.pollToken(pending.deviceCode);

    if (result.status === DeviceFlowStatus.PENDING) {
      await this.deviceFlowStore.set({
        ...pending,
        interval: result.slowDown
          ? pending.interval + SLOW_DOWN_INCREMENT_SECONDS
          : pending.interval,
        lastPollAt: now,
      });

      return DeviceFlowStatus.PENDING;
    }

    await this.tokenStore.set(toStoredState(result.token));
    await this.deviceFlowStore.clear();

    return DeviceFlowStatus.COMPLETE;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getValidAccessToken();
    return Boolean(token);
  }

  async getValidAccessToken(): Promise<string | null> {
    const state = await this.tokenStore.get();
    if (!state) return null;

    if (Date.now() < state.expiresAt - REFRESH_BUFFER_MS) {
      return state.accessToken;
    }

    if (!state.refreshToken) {
      await this.tokenStore.clear();
      return null;
    }

    const refreshed = await this.refreshAccessToken(state.refreshToken);
    return refreshed.accessToken;
  }

  async disconnect(): Promise<void> {
    const state = await this.tokenStore.get();

    if (state?.refreshToken || state?.accessToken) {
      const token = state.refreshToken ?? state.accessToken;

      try {
        await fetch(GOOGLE_REVOKE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ token }),
        });
      } catch {
        // Local disconnect should still work if the user is offline
        // or Google revocation temporarily fails.
      }
    }

    await Promise.all([this.tokenStore.clear(), this.deviceFlowStore.clear()]);
  }

  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<OAuthStoredState> {
    try {
      const token = await this.client.refreshAccessToken(refreshToken);
      const state = toStoredState(token, refreshToken);

      await this.tokenStore.set(state);

      return state;
    } catch (err) {
      await this.tokenStore.clear();
      throw err;
    }
  }
}
