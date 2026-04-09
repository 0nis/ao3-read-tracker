import { getFormattedDateTimeForFilename } from "./date";
import { extractKey } from "./misc";
import { toKebabCase } from "./string";
import { el } from "./ui/dom";
import { getManifest } from "../shared/extension/manifest";

/** True if the file type starts with "image/", aka the simple way of checking */
export const isImageFile = (file: File): boolean =>
  file.type.startsWith("image/");

/** Checks if a file is an image that can be resized */
export const isResizableWithCanvas = (file: File): boolean =>
  isImageFile(file) &&
  ["image/jpeg", "image/png", "image/webp"].includes(file.type);

/**
 * Extracts and formats unique image type names from a comma-separated MIME list.
 *
 * Example:
 * "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
 * -> ["PNG", "JPEG", "WEBP", "SVG", "ICO"]
 */
export const extractImageTypeNames = (types: string): string[] => {
  const seen = new Set<string>();
  return types
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .map((t) => {
      const name = t.replace(/^image\//, "");
      switch (name) {
        case "x-icon":
        case "vnd.microsoft.icon":
          return "ICO";
        case "svg+xml":
          return "SVG";
        default:
          return name.toUpperCase();
      }
    })
    .filter((type) => {
      if (seen.has(type)) return false;
      seen.add(type);
      return true;
    });
};

/** Converts a number of bytes to a human-readable string in KB or MB */
export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(bytes / 1_000)} KB`;
}

/**
 * Downloads a JSON file to the user's computer with the extension name, @param type, and a timestamp in the filename
 * @param data The data to download
 * @param type The type of data, to be used in the filename
 */
export function downloadFile(data: Blob, type: string): void {
  const extName = toKebabCase(getManifest()?.data?.name || "extension");
  const url = URL.createObjectURL(data);
  const a = el("a");

  a.href = url;
  a.download = `${extName}_${type}_${getFormattedDateTimeForFilename(
    Date.now(),
  )}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface DexieExportDbInfo {
  formatName: string | null;
  formatVersion: number | null;
  databaseName: string | null;
  databaseVersion: number | null;
}

/**
 * Iterates through a file and tries to extract the format name/version and database name/version.
 * Only use for Dexie.js export files
 */
export async function getDbInfoFromDexieExport(
  blob: Blob,
  chunkSizeInKb: number = 2,
): Promise<DexieExportDbInfo> {
  const chunkSize = 1024 * chunkSizeInKb;
  let offset = 0;
  let buffer = "";

  const result: DexieExportDbInfo = {
    formatName: null,
    formatVersion: null,
    databaseName: null,
    databaseVersion: null,
  };

  const keys: { key: string; type: "string" | "number" }[] = [
    { key: "formatName", type: "string" },
    { key: "formatVersion", type: "number" },
    { key: "databaseName", type: "string" },
    { key: "databaseVersion", type: "number" },
  ];

  const allKeysFound = () =>
    Object.values(result).every((value) => value !== null);

  while (offset < blob.size) {
    const chunk = blob.slice(offset, offset + chunkSize);
    buffer += await chunk.text();

    for (const { key, type } of keys) {
      if ((result as any)[key] !== null) continue;
      const extracted = extractKey(buffer, key, type);
      if (extracted !== null) (result as any)[key] = extracted;
    }

    if (allKeysFound()) break;

    offset += chunkSize;
  }

  return result;
}
