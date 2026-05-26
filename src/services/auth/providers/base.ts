import { AuthProviderType } from "../shared/enums";
import { DeviceFlowStatus } from "../oauth/device/enums";
import { DeviceFlowStartResponse } from "../oauth/device/types";

/**
 * Background-side auth implementation.
 *
 * Handlers run in extension context and may access extension storage,
 * provider secrets, token refresh logic, and external OAuth endpoints.
 */
export interface AuthHandlerBase {
  readonly provider: AuthProviderType;

  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;

  /**
   * Returns a valid access token, refreshing it if needed.
   * Returns null when the provider is not authenticated.
   */
  getValidAccessToken(): Promise<string | null>;
}

/** Handler capability for OAuth 2.0 Device Authorization Grant */
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
