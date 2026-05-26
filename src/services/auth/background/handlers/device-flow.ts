import { errorMessage, sendUnsupportedDeviceFlow } from "../helpers";
import { AnyAuthHandler, supportsDeviceFlow } from "../../providers/base";
import { AuthMessage } from "../../shared/types";
import {
  DeviceFlowStartResponse,
  DeviceFlowPollResponse,
} from "../../oauth/device/types";

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
    sendUnsupportedDeviceFlow(message.provider, sendResponse);
    return false;
  }

  handler
    .pollDeviceFlow()
    .then((status) => {
      sendResponse({
        ok: true,
        status,
      } satisfies DeviceFlowPollResponse);
    })
    .catch((err) => {
      sendResponse({
        ok: false,
        error: errorMessage(err),
        recoverable: false,
      } satisfies DeviceFlowPollResponse);
    });

  return true;
}
