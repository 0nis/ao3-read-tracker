import { DeviceFlowStatus } from "./enums";
import {
  DeviceCodeResponse,
  DeviceFlowClientConfig,
  DeviceFlowPollResult,
  RawDeviceCodeResponse,
  RawTokenResponse,
} from "./types";
import {
  DEVICE_CODE_GRANT_TYPE,
  FORM_HEADERS,
  REFRESH_TOKEN_GRANT_TYPE,
} from "./constants";

import { readJson, requireString, requireNumber } from "../helpers";
import { OAuthTokenResponse } from "../types";

export class DeviceOAuthClient {
  constructor(private readonly config: DeviceFlowClientConfig) {}

  async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const response = await fetch(this.config.deviceCodeUrl, {
      method: "POST",
      headers: FORM_HEADERS,
      body: new URLSearchParams({
        client_id: this.config.clientId,
        scope: this.config.scope,
      }),
    });
    const data = await readJson<RawDeviceCodeResponse>(response);

    this.assertOAuthSuccess(response, data);

    return {
      deviceCode: requireString(data.device_code, "device_code"),
      userCode: requireString(data.user_code, "user_code"),
      verificationUrl: requireString(
        data.verification_url ?? data.verification_uri,
        "verification_url",
      ),
      expiresIn: requireNumber(data.expires_in, "expires_in"),
      interval: data.interval ?? 5,
    };
  }

  async pollToken(deviceCode: string): Promise<DeviceFlowPollResult> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      device_code: deviceCode,
      grant_type: DEVICE_CODE_GRANT_TYPE,
    });

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: FORM_HEADERS,
      body,
    });

    const data = await readJson<RawTokenResponse>(response);

    if (data.error === "authorization_pending")
      return {
        status: DeviceFlowStatus.PENDING,
      };

    if (data.error === "slow_down")
      return {
        status: DeviceFlowStatus.PENDING,
        slowDown: true,
      };

    this.assertOAuthSuccess(response, data);

    return {
      status: DeviceFlowStatus.COMPLETE,
      token: this.normalizeTokenResponse(data),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
      grant_type: REFRESH_TOKEN_GRANT_TYPE,
    });

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: FORM_HEADERS,
      body,
    });

    const data = await readJson<RawTokenResponse>(response);

    this.assertOAuthSuccess(response, data);

    return this.normalizeTokenResponse(data);
  }

  private assertOAuthSuccess(
    response: Response,
    data: RawTokenResponse | RawDeviceCodeResponse,
  ): void {
    if (!response.ok || data.error)
      throw new Error(this.getOAuthErrorMessage(data));
  }

  private getOAuthErrorMessage(
    data: RawTokenResponse | RawDeviceCodeResponse,
  ): string {
    const error = {
      error: data.error ?? "unknown_oauth_error",
      errorDescription: data.error_description,
    };

    return error.errorDescription
      ? `${error.error}: ${error.errorDescription}`
      : error.error;
  }

  private normalizeTokenResponse(data: RawTokenResponse): OAuthTokenResponse {
    return {
      accessToken: requireString(data.access_token, "access_token"),
      refreshToken: data.refresh_token,
      expiresIn: requireNumber(data.expires_in, "expires_in"),
      refreshTokenExpiresIn: data.refresh_token_expires_in,
      scope: data.scope,
      tokenType: data.token_type,
    };
  }
}
