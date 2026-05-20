import { AuthProvider, DeviceFlowStatus } from "./enums";
import { DeviceFlowStartResponse } from "../oauth/device/types";

export interface AuthProviderBase {
  readonly provider: AuthProvider;

  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;

  /**
   * Returns a valid access token if available.
   * Background-only consumers such as backup services can use this later.
   */
  getValidAccessToken(): Promise<string | null>;
}

export interface DeviceAuthProvider extends AuthProviderBase {
  readonly supportsDeviceFlow: true;

  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}

export interface RedirectAuthProvider extends AuthProviderBase {
  readonly supportsRedirectFlow: true;

  startRedirectFlow(): Promise<unknown>;
  completeRedirectFlow(callbackUrl: string): Promise<void>;
}

export type AnyAuthProvider =
  | DeviceAuthProvider
  | RedirectAuthProvider
  | (DeviceAuthProvider & RedirectAuthProvider);

export function supportsDeviceFlow(
  provider: AnyAuthProvider,
): provider is DeviceAuthProvider {
  return (
    "supportsDeviceFlow" in provider && provider.supportsDeviceFlow === true
  );
}

export function supportsRedirectFlow(
  provider: AnyAuthProvider,
): provider is RedirectAuthProvider {
  return (
    "supportsRedirectFlow" in provider && provider.supportsRedirectFlow === true
  );
}
