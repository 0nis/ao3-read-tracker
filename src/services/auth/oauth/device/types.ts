import { DeviceFlowStatus } from "./enums";
import { OAuthTokenResponse } from "../types";
import { AuthProviderType } from "../../shared/enums";

export type DeviceCodeResponse = {
  deviceCode: string;
  userCode: string;
  verificationUrl: string;
  expiresIn: number;
  interval: number;
};

export type DeviceFlowClientConfig = {
  provider: AuthProviderType;
  deviceCodeUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
};

export type DeviceFlowStartResponse =
  | {
      ok: true;
      provider: AuthProviderType;
      verificationUrl: string;
      userCode: string;
      expiresIn: number;
      interval: number;
    }
  | {
      ok: false;
      error: string;
    };

export type DeviceFlowPollResponse =
  | {
      ok: true;
      status: DeviceFlowStatus;
    }
  | {
      ok: false;
      error: string;
      recoverable?: boolean;
    };

export type DeviceFlowPollResult =
  | {
      status: DeviceFlowStatus.PENDING;
      slowDown?: boolean;
    }
  | {
      status: DeviceFlowStatus.COMPLETE;
      token: OAuthTokenResponse;
    };

export type RawDeviceCodeResponse = {
  device_code?: string;
  user_code?: string;
  verification_url?: string;
  verification_uri?: string;
  expires_in?: number;
  interval?: number;
  error?: string;
  error_description?: string;
};

export type RawTokenResponse = {
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
