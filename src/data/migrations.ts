type MigrationFn = (row: any, tableName: string) => any;

/**
 * Keyed by the *version being upgraded from*.
 * Add a new entry when a new version needs migration.
 */
export const migrations: Record<number, MigrationFn[]> = {
  // Wow, such empty
  // EXAMPLE:
  //   1: [
  //     (row, tableName) => {
  //       if (tableName === "readWorks") {
  //         if (!("newField" in row)) row.newField = "default";
  //       }
  //       return row;
  //     },
  //   ],
};
