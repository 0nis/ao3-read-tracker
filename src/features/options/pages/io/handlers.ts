import { ExportProgress } from "dexie-export-import";
import { ImportProgress } from "dexie-export-import/dist/import";

export function handleProgressCallback(
  setProgress: ((v: number) => void) | undefined,
  {
    completedRows,
    totalRows,
    completedTables,
    totalTables,
  }: ImportProgress | ExportProgress
) {
  const percent =
    totalRows !== undefined
      ? Math.round((completedRows / totalRows) * 100)
      : Math.round((completedTables / totalTables) * 100);

  setProgress?.(percent);
  return true;
}
