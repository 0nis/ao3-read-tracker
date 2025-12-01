import { createWorkForm } from "../base";
import { WorkAction } from "../../config";
import { textarea } from "../helpers/inputs";
import { WorkFormFieldType, WorkFormItem } from "../types";

import { IgnoredWork } from "../../../../types/works";

const items: WorkFormItem<IgnoredWork>[] = [
  {
    type: WorkFormFieldType.FIELD,
    dataField: "reason",
    label: "Reason for ignoring",
    description:
      "A private reason that will appear in the work summary block for this work.",
    input: textarea(3),
  },
];

export function createIgnoreWorkForm(
  data: Partial<IgnoredWork>,
  editing: boolean
): HTMLElement {
  return createWorkForm({
    id: WorkAction.IGNORE,
    landmark: "Ignore Work",
    heading: editing ? "Edit ignore work info" : "Ignore this work",
    data,
    editing,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and ignore ${data.title || "this work"}`,
      },
      delete: {
        isDeletable: editing === true,
        label: "Unignore",
        ariaLabel: `Remove ${data.title || "this work"} from your ignored list`,
      },
    },
  });
}
