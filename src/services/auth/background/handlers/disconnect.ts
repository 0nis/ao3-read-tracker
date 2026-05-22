import { errorMessage } from "../helpers";
import { AnyAuthProvider } from "../../providers/base/provider";
import { AuthDisconnectResponse } from "../../shared/types";

export function handleDisconnect(
  provider: AnyAuthProvider,
  sendResponse: (response: unknown) => void,
): boolean {
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
