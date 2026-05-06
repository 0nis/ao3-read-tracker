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

/** Helper to extract string or number keys from a JSON-like string buffer */
const extractKey = (buffer: string, key: string, type: "string" | "number") => {
  const regex =
    type === "string"
      ? new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`)
      : new RegExp(`"${key}"\\s*:\\s*(\\d+)`);
  const match = buffer.match(regex);
  if (match) return type === "string" ? match[1] : Number(match[1]);
};
