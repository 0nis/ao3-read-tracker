import { getManifest } from "./manifest";

export function createExtensionMsg(msg: string): string {
  return `[${getManifest().data?.name ?? "Extension"}] ${msg}`;
}

/** For critical errors that break functionality */
export const error = (msg: string): void => {
  console.error(createExtensionMsg(msg));
};

/** For unexpected but non-critical issues */
export const warn = (msg: string): void => {
  console.warn(createExtensionMsg(msg));
};

/** For general extension activity and status messages */
export const log = (msg: string): void => {
  console.log(createExtensionMsg(msg));
};

/** For information messages about extension state or actions */
export const info = (msg: string): void => {
  console.info(createExtensionMsg(msg));
};

/** For verbose output useful during development and debugging */
export const debug = (msg: string): void => {
  console.debug(createExtensionMsg(msg));
};
