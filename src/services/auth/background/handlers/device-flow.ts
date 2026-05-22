import { errorMessage, sendUnsupportedDeviceFlow } from "../helpers";
import {
  AnyAuthHandler,
  supportsDeviceFlow,
} from "../../providers/base/handler";
import { AuthMessage, AuthPollResponse } from "../../shared/types";
import { DeviceFlowStartResponse } from "../../oauth/device/types";

export function handleStartDeviceFlow(
  message: AuthMessage,
  handler: AnyAuthHandler,
  sendResponse: (response: unknown) => void,
): boolean {
  if (!supportsDeviceFlow(handler)) {
    sendUnsupportedDeviceFlow(message.provider, sendResponse);
    return false;
  }

  handler
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
  handler: AnyAuthHandler,
  sendResponse: (response: unknown) => void,
): boolean {
  if (!supportsDeviceFlow(handler)) {
    sendResponse({
      ok: false,
      error: `Provider "${message.provider}" does not support device flow.`,
      recoverable: false,
    } satisfies AuthPollResponse);

    return false;
  }

  handler
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
