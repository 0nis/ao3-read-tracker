import { DeviceFlowStartResponse } from "../../oauth/device/types";
import { AuthProviderType, DeviceFlowStatus } from "../../shared/enums";

export interface AuthProxyBase {
  readonly provider: AuthProviderType;

  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
}

export interface DeviceAuthProxy extends AuthProxyBase {
  readonly supportsDeviceFlow: true;

  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}

export interface RedirectAuthProxy extends AuthProxyBase {
  readonly supportsRedirectFlow: true;

  startRedirectFlow(): Promise<unknown>;
  completeRedirectFlow(callbackUrl: string): Promise<void>;
}

export type AnyAuthProxy =
  | DeviceAuthProxy
  | RedirectAuthProxy
  | (DeviceAuthProxy & RedirectAuthProxy);

export function supportsDeviceFlow(
  handler: AnyAuthProxy,
): handler is DeviceAuthProxy {
  return "supportsDeviceFlow" in handler && handler.supportsDeviceFlow === true;
}

export function supportsRedirectFlow(
  provider: AnyAuthProxy,
): provider is RedirectAuthProxy {
  return (
    "supportsRedirectFlow" in provider && provider.supportsRedirectFlow === true
  );
}
