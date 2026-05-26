import { BackupMessage } from "../shared/messages";

export function isBackupMessage(message: unknown): message is BackupMessage {
  if (!message || typeof message !== "object") return false;

  const candidate = message as Partial<BackupMessage>;

  return (
    typeof candidate.type === "string" && typeof candidate.provider === "string"
  );
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
