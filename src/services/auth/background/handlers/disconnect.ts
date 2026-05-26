import { errorMessage } from "../helpers";
import { AnyAuthHandler } from "../../providers/base";
import { AuthDisconnectResponse } from "../../shared/types";

export function handleDisconnect(
  handler: AnyAuthHandler,
  sendResponse: (response: unknown) => void,
): boolean {
  handler
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
