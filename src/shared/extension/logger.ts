import { getManifest } from "./manifest";

/** Get the extension name from the manifest formatted for console output prefixes */
export function getExtensionMsgPrefix(): string {
  return `[${getManifest().data?.name ?? "AO3 Read Tracker"}] `;
}

/** Prepend the extension name to a message */
export function createExtensionMsg(msg: string): string {
  return `${getExtensionMsgPrefix()}${msg}`;
}

/** For critical errors that break functionality */
export const error = (...msgs: unknown[]): void => {
  console.error(getExtensionMsgPrefix(), ...msgs);
};

/** For unexpected but non-critical issues */
export const warn = (...msgs: unknown[]): void => {
  console.warn(getExtensionMsgPrefix(), ...msgs);
};

/** For general extension activity and status messages */
export const log = (...msgs: unknown[]): void => {
  console.log(getExtensionMsgPrefix(), ...msgs);
};

/** For information messages about extension state or actions */
export const info = (...msgs: unknown[]): void => {
  console.info(getExtensionMsgPrefix(), ...msgs);
};

/** For verbose output useful during development and debugging */
export const debug = (...msgs: unknown[]): void => {
  console.debug(getExtensionMsgPrefix(), ...msgs);
};
