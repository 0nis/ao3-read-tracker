import { StorageResult } from "../../types/results";
import { error } from "./console";

interface ExtensionManifest {
  name: string;
  version: string;
  homepage_url?: string;
  author?: string;
  description?: string;
}

let cachedManifest: ExtensionManifest | null = null;

/**
 * Safely retrieves the extension manifest.
 * Caches the result for future calls.
 */
export function getManifest(): StorageResult<ExtensionManifest> {
  if (cachedManifest)
    return {
      data: cachedManifest,
      success: true,
    };

  try {
    const runtime =
      typeof chrome !== "undefined" ? chrome.runtime : browser?.runtime;
    if (!runtime?.getManifest)
      throw new Error("Runtime manifest API not available");

    const manifest = runtime.getManifest() as ExtensionManifest;
    if (!manifest?.name) throw new Error("Manifest is missing required fields");

    cachedManifest = manifest;
    return {
      data: manifest,
      success: true,
    };
  } catch (err) {
    const msg = getCriticalManifestError(
      err instanceof Error ? err.message : String(err)
    );
    error("Failed to access manifest:", msg, err);

    return {
      error: msg,
      success: false,
    };
  }
}

/**
 * Replaces manifest placeholders in a string with actual values.
 * Supported placeholders: %name%, %version%, %url%, %author%, %description%
 * If the manifest cannot be accessed, returns a critical error message.
 */
export function replaceManifestPlaceholders(template: string): string {
  const manifestResult = getManifest();
  if (!manifestResult.success || !manifestResult.data)
    return manifestResult?.error as string;

  const manifest = manifestResult.data;

  const fields: Record<string, string> = {
    name: manifest.name,
    version: manifest.version,
    url: manifest.homepage_url ?? "[url unknown]",
    author: manifest.author ?? "[author unknown]",
    description: manifest.description ?? "[description unknown]",
  };

  return Object.entries(fields).reduce(
    (result, [key, value]) => result.split(`%${key}%`).join(value),
    template
  );
}

function getCriticalManifestError(reason?: string): string {
  const baseMessage =
    "⚠️ CRITICAL ERROR ⚠️\n\n" + "The extension could not access its manifest.";

  const reasonMessage = reason ? `\nReason: ${reason}` : "";
  const helpMessage =
    "\n\nPlease try reloading the extension or contact the developer:\n" +
    "https://github.com/0nis";

  return baseMessage + reasonMessage + helpMessage;
}
