import { errorMessage } from "../helpers";
import { AnyAuthProvider } from "../../providers/base/provider";
import { AuthStatusResponse } from "../../shared/types";

export function handleStatus(
  provider: AnyAuthProvider,
  sendResponse: (response: unknown) => void,
): boolean {
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
