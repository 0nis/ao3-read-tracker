import { GoogleDeviceOAuth } from "../services/auth/providers/google/device-oauth";

import { AuthMessageType, AuthProvider } from "../services/auth/shared/enums";
import {
  AuthDisconnectResponse,
  AuthMessage,
  AuthPollResponse,
  AuthStatusResponse,
} from "../services/auth/shared/types";
import { DeviceFlowStartResponse } from "../services/auth/oauth/device/types";
import { debug } from "../shared/extension/logger";

debug("Background script loaded.");

// TODO: Make type provider-agnostic
const authProviders = {
  [AuthProvider.GOOGLE]: new GoogleDeviceOAuth(),
} satisfies Record<AuthProvider, GoogleDeviceOAuth>;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAuthMessage(message: unknown): message is AuthMessage {
  if (!message || typeof message !== "object") return false;

  const candidate = message as Partial<AuthMessage>;

  return (
    typeof candidate.type === "string" && typeof candidate.provider === "string"
  );
}

// TODO: Make return type provider-agnostic
function getProvider(provider: AuthProvider): GoogleDeviceOAuth {
  const authProvider = authProviders[provider];
  if (!authProvider)
    throw new Error(`Unsupported auth provider: ${String(provider)}`);
  return authProvider;
}

chrome.runtime.onMessage.addListener(
  (message: unknown, _sender, sendResponse: (response: unknown) => void) => {
    if (!isAuthMessage(message)) return false;
    debug("Received auth message:", message);

    // TODO: Make type provider-agnostic
    let provider: GoogleDeviceOAuth;

    try {
      provider = getProvider(message.provider);
    } catch (err) {
      sendResponse({
        ok: false,
        error: errorMessage(err),
      });

      return false;
    }

    switch (message.type) {
      case AuthMessageType.START_DEVICE_FLOW: {
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

      case AuthMessageType.POLL_DEVICE_FLOW: {
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

      case AuthMessageType.STATUS: {
        provider
          .isAuthenticated()
          .then((authenticated) => {
            sendResponse({
              ok: true,
              authenticated,
            } satisfies AuthStatusResponse);
          })
          .catch((err) => {
            sendResponse({
              ok: false,
              error: errorMessage(err),
            } satisfies AuthStatusResponse);
          });

        return true;
      }

      case AuthMessageType.DISCONNECT: {
        provider
          .disconnect()
          .then(() => {
            sendResponse({
              ok: true,
            } satisfies AuthDisconnectResponse);
          })
          .catch((err) => {
            sendResponse({
              ok: false,
              error: errorMessage(err),
            } satisfies AuthDisconnectResponse);
          });

        return true;
      }

      default: {
        sendResponse({
          ok: false,
          error: `Unsupported auth message type: ${String(message.type)}`,
        });

        return false;
      }
    }
  },
);
