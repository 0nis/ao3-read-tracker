import { getFormattedDateTimeForFilename } from "./date";
import { getManifest } from "./extension";
import { extractKey } from "./misc";
import { el } from "./ui/dom";

export function downloadFile(data: Blob, type: string): void {
  const extName = getManifest()?.data?.name || "extension";
  const extNameSlug = extName.toLowerCase().replace(/\s+/g, "-");
  const url = URL.createObjectURL(data);
  const a = el("a");

  a.href = url;
  a.download = `${extNameSlug}_${type}_${getFormattedDateTimeForFilename(
    Date.now()
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

export async function getDbInfoFromDexieExport(
  blob: Blob,
  chunkSizeInKb: number = 2
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

  while (offset < blob.size) {
    const chunk = blob.slice(offset, offset + chunkSize);
    buffer += await chunk.text();

    const keys: {
      key: string;
      type: "string" | "number";
    }[] = [
      { key: "formatName", type: "string" },
      { key: "formatVersion", type: "number" },
      { key: "databaseName", type: "string" },
      { key: "databaseVersion", type: "number" },
    ];

    for (const { key, type } of keys) {
      if ((result as any)[key] !== null) continue;
      const extracted = extractKey(buffer, key, type);
      if (extracted !== null) (result as any)[key] = extracted;
    }

    if (
      result.formatName &&
      result.formatVersion !== null &&
      result.databaseVersion !== null
    ) {
      return result;
    }

    offset += chunkSize;
  }

  return result;
}
