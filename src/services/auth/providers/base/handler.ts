import { AuthProvider, DeviceFlowStatus } from "../../shared/enums";
import { DeviceFlowStartResponse } from "../../oauth/device/types";

export interface AuthHandlerBase {
  readonly provider: AuthProvider;

  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
  getValidAccessToken(): Promise<string | null>;
}

export interface DeviceAuthHandler extends AuthHandlerBase {
  readonly supportsDeviceFlow: true;

  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}

export interface RedirectAuthHandler extends AuthHandlerBase {
  readonly supportsRedirectFlow: true;

  startRedirectFlow(): Promise<unknown>;
  completeRedirectFlow(callbackUrl: string): Promise<void>;
}

export type AnyAuthHandler =
  | DeviceAuthHandler
  | RedirectAuthHandler
  | (DeviceAuthHandler & RedirectAuthHandler);

export function supportsDeviceFlow(
  handler: AnyAuthHandler,
): handler is DeviceAuthHandler {
  return "supportsDeviceFlow" in handler && handler.supportsDeviceFlow === true;
}

export function supportsRedirectFlow(
  provider: AnyAuthHandler,
): provider is RedirectAuthHandler {
  return (
    "supportsRedirectFlow" in provider && provider.supportsRedirectFlow === true
  );
}
