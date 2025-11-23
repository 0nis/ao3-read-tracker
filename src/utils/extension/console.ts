import { getManifest } from "./manifest";

export function createExtensionMsg(msg: string): string {
  return `[${getManifest().data?.name ?? "Extension"}] ${msg}`;
}
