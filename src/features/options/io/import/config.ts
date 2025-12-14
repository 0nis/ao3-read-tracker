import { ImportOptions } from "dexie-export-import";
import {
  confirmDestructiveAction,
  showConfirm,
} from "../../../../utils/ui/dialogs";
import { handleImport } from "./handlers";
import { createExistenceCache } from "../../../../data/cache/existence";
import { CLASS_PREFIX } from "../../../../constants/classes";

const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
  acceptVersionDiff: true,
  acceptMissingTables: true,
  acceptNameDiff: false,
  acceptChangedPrimaryKey: false,
};

export interface ExpandableItemParams {
  label: string;
  description: string;
  className?: string;
  onClick?: (btn: HTMLButtonElement, file: Blob) => Promise<void>;
  onConfirm?: () => boolean;
}

export const getExpandedImportButtons = (): ExpandableItemParams[] => [
  {
    label: "Import Only New Data",
    description: "Import data that does not already exist in your current data",
    className: `${CLASS_PREFIX}__button`,
    onClick: async (btn, file) => {
      const exists = await createExistenceCache();
      return await handleImport(
        btn,
        file,
        {
          overwriteValues: false,
          clearTablesBeforeImport: false,
          // Only import entries that do not already exist, otherwise it will throw an error
          filter: (tableName: string, value: any) =>
            !exists.has(tableName, value.id),
          ...DEFAULT_IMPORT_OPTIONS,
        },
        "Yay, successfully imported your new data! Enjoy!"
      );
    },
    onConfirm: () => {
      return showConfirm(
        "Importing data will add only new entries to your existing data. No current data will be overwritten. Do you want to proceed?"
      );
    },
  },
  {
    label: "Merge & Overwrite Duplicates",
    description:
      "Merge imported data with your current data, overwriting any duplicates",
    className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger`,
    onClick: async (btn, file) => {
      return await handleImport(btn, file, {
        overwriteValues: true,
        clearTablesBeforeImport: false,
        ...DEFAULT_IMPORT_OPTIONS,
      });
    },
    onConfirm: () => {
      return confirmDestructiveAction(
        "Importing data will merge with your existing data. CONFLICTING ENTRIES WILL BE OVERWRITTEN. Do you want to proceed?",
        "MERGE MY DATA"
      );
    },
  },
  {
    label: "Overwrite Data",
    description: "Overwrite your current data with an exported file",
    className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger`,
    onClick: async (btn, file) => {
      return await handleImport(btn, file, {
        overwriteValues: true,
        clearTablesBeforeImport: true,
        ...DEFAULT_IMPORT_OPTIONS,
      });
    },
    onConfirm: () => {
      return confirmDestructiveAction(
        "Importing data will overwrite your existing data. That means YOUR CURRENT DATA WILL BE LOST. Do you want to proceed?",
        "OVERWRITE MY DATA"
      );
    },
  },
];
