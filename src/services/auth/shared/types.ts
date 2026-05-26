import { AuthMessageType, AuthProviderType } from "./enums";

export type AuthMessage = {
  type: AuthMessageType;
  provider: AuthProviderType;
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

export type AuthDisconnectResponse =
  | { ok: true }
  | { ok: false; error: string };
