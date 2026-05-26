import { AuthMessage } from "../shared/types";

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function isAuthMessage(message: unknown): message is AuthMessage {
  if (!message || typeof message !== "object") return false;

  const candidate = message as Partial<AuthMessage>;

  return (
    candidate.isAuthMessage === true &&
    typeof candidate.type === "string" &&
    typeof candidate.provider === "string"
  );
}

export function sendUnsupportedDeviceFlow(
  providerName: string,
  sendResponse: (response: unknown) => void,
): void {
  sendResponse({
    ok: false,
    error: `Provider "${providerName}" does not support device flow.`,
  });
}
