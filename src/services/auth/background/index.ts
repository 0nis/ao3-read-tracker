import { getAuthProvider } from "../providers/registry";
import { errorMessage, isAuthMessage } from "./helpers";

import {
  handlePollDeviceFlow,
  handleStartDeviceFlow,
} from "./handlers/device-flow";
import { handleStatus } from "./handlers/status";
import { handleDisconnect } from "./handlers/disconnect";

import { AnyAuthHandler } from "../providers/base/handler";
import { AuthMessageType } from "../shared/enums";
import { AuthMessage } from "../shared/types";
import { debug } from "../../../shared/extension/logger";

function handleAuthMessage(
  message: AuthMessage,
  sendResponse: (response: unknown) => void,
): boolean {
  let handler: AnyAuthHandler;

  try {
    handler = getAuthProvider(message.provider);
  } catch (err) {
    sendResponse({
      ok: false,
      error: errorMessage(err),
    });
    return false;
  }

  switch (message.type) {
    case AuthMessageType.START_DEVICE_FLOW:
      return handleStartDeviceFlow(message, handler, sendResponse);

    case AuthMessageType.POLL_DEVICE_FLOW:
      return handlePollDeviceFlow(message, handler, sendResponse);

    case AuthMessageType.STATUS:
      return handleStatus(handler, sendResponse);

    case AuthMessageType.DISCONNECT:
      return handleDisconnect(handler, sendResponse);

    default: {
      sendResponse({
        ok: false,
        error: `Unsupported auth message type: ${String(message.type)}`,
      });

      return false;
    }
  }
}

export function registerAuthBackground(): void {
  debug("Auth background registered.");

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isAuthMessage(message)) return false;
    debug("Received auth message:", message);

    return handleAuthMessage(message, sendResponse);
  });
}
