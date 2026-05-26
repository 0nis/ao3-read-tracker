import { AuthProviderType, DeviceFlowStatus } from "../../shared/enums";
import { DeviceFlowStartResponse } from "../../oauth/device/types";

export interface AuthHandlerBase {
  readonly provider: AuthProviderType;

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
  handler: AnyAuthHandler,
): handler is RedirectAuthHandler {
  return (
    "supportsRedirectFlow" in handler && handler.supportsRedirectFlow === true
  );
}
