import { OAuthTokenResponse } from "../token-types";
import { AuthProviderType, DeviceFlowStatus } from "../../shared/enums";

export type DeviceCodeResponse = {
  deviceCode: string;
  userCode: string;
  verificationUrl: string;
  expiresIn: number;
  interval: number;
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

export type DeviceFlowClientConfig = {
  provider: AuthProviderType;
  deviceCodeUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret?: string;
  scope: string;
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
