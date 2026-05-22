import { errorMessage } from "../helpers";
import { AnyAuthHandler } from "../../providers/base/handler";
import { AuthStatusResponse } from "../../shared/types";

export function handleStatus(
  handler: AnyAuthHandler,
  sendResponse: (response: unknown) => void,
): boolean {
  handler
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
