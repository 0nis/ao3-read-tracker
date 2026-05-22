import { getFormattedDateTimeForFilename } from "../utils/date";
import { toKebabCase } from "../utils/string";
import { getFullExtensionName } from "./extension/manifest";

export function getBackupFileName({
  type = "backup",
  datetime = Date.now(),
  fileType = "json",
}: {
  type: string;
  datetime: number;
  fileType?: string;
}): string {
  return `${toKebabCase(getFullExtensionName())}_${type}_${getFormattedDateTimeForFilename(
    datetime,
  )}.${fileType}`;
}
