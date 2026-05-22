import { errorMessage, sendUnsupportedDeviceFlow } from "../helpers";
import {
  AnyAuthProvider,
  supportsDeviceFlow,
} from "../../providers/base/provider";
import { AuthMessage, AuthPollResponse } from "../../shared/types";
import { DeviceFlowStartResponse } from "../../oauth/device/types";

export function handleStartDeviceFlow(
  message: AuthMessage,
  provider: AnyAuthProvider,
  sendResponse: (response: unknown) => void,
): boolean {
  if (!supportsDeviceFlow(provider)) {
    sendUnsupportedDeviceFlow(message.provider, sendResponse);
    return false;
  }

  provider
    .startDeviceFlow()
    .then((response: DeviceFlowStartResponse) => {
      sendResponse(response);
    })
    .catch((err) => {
      sendResponse({
        ok: false,
        error: errorMessage(err),
      } satisfies DeviceFlowStartResponse);
    });

  return true;
}

export function handlePollDeviceFlow(
  message: AuthMessage,
  provider: AnyAuthProvider,
  sendResponse: (response: unknown) => void,
): boolean {
  if (!supportsDeviceFlow(provider)) {
    sendResponse({
      ok: false,
      error: `Provider "${message.provider}" does not support device flow.`,
      recoverable: false,
    } satisfies AuthPollResponse);

    return false;
  }

  provider
    .pollDeviceFlow()
    .then((status) => {
      sendResponse({
        ok: true,
        status,
      } satisfies AuthPollResponse);
    })
    .catch((err) => {
      sendResponse({
        ok: false,
        error: errorMessage(err),
        recoverable: false,
      } satisfies AuthPollResponse);
    });

  return true;
}
