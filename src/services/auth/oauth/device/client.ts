import {
  DeviceCodeResponse,
  DeviceFlowClientConfig,
  DeviceFlowPollResult,
} from "./types";
import { readJson, requireString, requireNumber } from "../helpers";
import { OAuthErrorResponse, OAuthTokenResponse } from "../token-types";
import { DeviceFlowStatus } from "../../shared/enums";

type RawDeviceCodeResponse = {
  device_code?: string;
  user_code?: string;
  verification_url?: string;
  verification_uri?: string;
  expires_in?: number;
  interval?: number;
  error?: string;
  error_description?: string;
};

type RawTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
};

const DEVICE_CODE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";

function toOAuthError(
  data: RawTokenResponse | RawDeviceCodeResponse,
): OAuthErrorResponse {
  return {
    error: data.error ?? "unknown_oauth_error",
    errorDescription: data.error_description,
  };
}

export class DeviceOAuthClient {
  constructor(private config: DeviceFlowClientConfig) {}

  async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const response = await fetch(this.config.deviceCodeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        scope: this.config.scope,
      }),
    });

    const data = await readJson<RawDeviceCodeResponse>(response);

    if (!response.ok || data.error) {
      const error = toOAuthError(data);

      throw new Error(
        error.errorDescription
          ? `${error.error}: ${error.errorDescription}`
          : error.error,
      );
    }

    const verificationUrl = data.verification_url ?? data.verification_uri;

    return {
      deviceCode: requireString(data.device_code, "device_code"),
      userCode: requireString(data.user_code, "user_code"),
      verificationUrl: requireString(verificationUrl, "verification_url"),
      expiresIn: requireNumber(data.expires_in, "expires_in"),
      interval: data.interval ?? 5,
    };
  }

  async pollToken(deviceCode: string): Promise<DeviceFlowPollResult> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      device_code: deviceCode,
      grant_type: DEVICE_CODE_GRANT_TYPE,
    });

    if (this.config.clientSecret)
      body.set("client_secret", this.config.clientSecret);

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await readJson<RawTokenResponse>(response);

    if (data.error === "authorization_pending") {
      return {
        status: DeviceFlowStatus.PENDING,
      };
    }

    if (data.error === "slow_down") {
      return {
        status: DeviceFlowStatus.PENDING,
        slowDown: true,
      };
    }

    if (!response.ok || data.error) {
      const error = toOAuthError(data);

      throw new Error(
        error.errorDescription
          ? `${error.error}: ${error.errorDescription}`
          : error.error,
      );
    }

    return {
      status: DeviceFlowStatus.COMPLETE,
      token: this.normalizeTokenResponse(data),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    if (this.config.clientSecret)
      body.set("client_secret", this.config.clientSecret);

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await readJson<RawTokenResponse>(response);

    if (!response.ok || data.error) {
      const error = toOAuthError(data);

      throw new Error(
        error.errorDescription
          ? `${error.error}: ${error.errorDescription}`
          : error.error,
      );
    }

    return this.normalizeTokenResponse(data);
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
