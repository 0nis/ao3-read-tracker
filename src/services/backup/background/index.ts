import { backupHandlerRegistry } from "./registry";
import { errorMessage, isBackupMessage } from "./helpers";

import { BackupMessageType } from "../shared/enums";
import { BackupMessage } from "../shared/messages";
import { debug } from "../../../shared/extension/logger";

function handleBackupMessage(
  message: BackupMessage,
  sendResponse: (response: unknown) => void,
): boolean {
  let handler;

  try {
    handler = backupHandlerRegistry.get(message.provider);
  } catch (err) {
    sendResponse({
      success: false,
      error: errorMessage(err),
    });
    return false;
  }

  Promise.resolve()
    .then(async () => {
      switch (message.type) {
        case BackupMessageType.IS_AVAILABLE:
          return {
            success: true,
            data: await handler.isAvailable(),
          };

        case BackupMessageType.GET_TARGET:
          return await handler.getTarget(message.config);

        case BackupMessageType.DIRECT_UPLOAD:
          return await handler.uploadDirect(message.input);

        case BackupMessageType.START_UPLOAD:
          return await handler.startUpload(message.input);

        case BackupMessageType.UPLOAD_CHUNK:
          return await handler.uploadChunk(message.input);

        case BackupMessageType.LIST:
          return await handler.list(message.target);

        case BackupMessageType.DELETE:
          return await handler.delete(message.fileId);

        case BackupMessageType.CLEAR:
          return await handler.clear(message.target);

        default:
          return {
            success: false,
            error: `Unsupported backup message type`,
          };
      }
    })
    .then(sendResponse)
    .catch((err) => {
      sendResponse({
        success: false,
        error: errorMessage(err),
      });
    });

  return true;
}

export function registerBackupBackground(): void {
  debug("Backup background registered");

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isBackupMessage(message)) return false;

    debug("Received backup message:", message);

    return handleBackupMessage(message, sendResponse);
  });
}
