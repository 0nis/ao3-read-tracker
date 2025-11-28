import {
  handleImportOnlyNew,
  handleMergeImport,
  handleOverwriteImport,
} from "../../handlers";

export interface ExpandableItemParams {
  label: string;
  description: string;
  className?: string;
  onClick?: (e: Event, file: Blob) => Promise<void>;
}

export const getExpandedImportButtons = (
  prefix: string
): ExpandableItemParams[] => [
  {
    label: "Import Only New Data",
    description: "Import data that does not already exist in your current data",
    className: `${prefix}__button`,
    onClick: handleImportOnlyNew,
  },
  {
    label: "Merge & Overwrite Duplicates",
    description:
      "Merge imported data with your current data, overwriting any duplicates",
    className: `${prefix}__button ${prefix}__button--danger`,
    onClick: handleMergeImport,
  },
  {
    label: "Overwrite Data",
    description: "Overwrite your current data with an exported file",
    className: `${prefix}__button ${prefix}__button--danger`,
    onClick: handleOverwriteImport,
  },
];
