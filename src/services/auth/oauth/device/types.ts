import { OAuthTokenResponse } from "../token-types";
import { AuthProvider, DeviceFlowStatus } from "../../shared/enums";

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
      provider: AuthProvider;
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
  provider: AuthProvider;
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
