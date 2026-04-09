import { el } from "./ui/dom";

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
 * Downloads the specified blob as a file to the user's computer
 * @param blob The blob to download
 * @param filename The name of the file when downloaded, including extension (e.g. "file.txt")
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
