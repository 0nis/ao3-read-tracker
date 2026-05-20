import { AuthMessageType, AuthProvider, DeviceFlowStatus } from "./enums";

export type AuthMessage = {
  type: AuthMessageType;
  provider: AuthProvider;
};

export type AuthStatusResponse =
  | {
      ok: true;
      authenticated: boolean;
      expiresAt?: number;
    }
  | {
      ok: false;
      error: string;
    };

export type AuthPollResponse =
  | {
      ok: true;
      status: DeviceFlowStatus;
    }
  | {
      ok: false;
      error: string;
      recoverable?: boolean;
    };

export type AuthDisconnectResponse =
  | { ok: true }
  | { ok: false; error: string };
