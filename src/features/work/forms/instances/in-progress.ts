import { createWorkForm } from "../base";
import { WorkAction } from "../../config";
import { textarea } from "../helpers/inputs";
import { WorkFormFieldType, WorkFormItem } from "../types";

import { InProgressWork } from "../../../../types/works";
import { ButtonPlacement } from "../../../../enums/settings";

const items: WorkFormItem<InProgressWork>[] = [
  {
    type: WorkFormFieldType.FIELD,
    dataField: "notes",
    label: "Notes",
    description:
      "Private notes that will appear in the work summary block for this work.",
    input: textarea(3),
  },
  // TODO: Add the rest of the fields
  // Uses buildSelectFromEnum for the status field
  // What to use for the date ??? idk yet
];

export function createInProgressWorkForm(
  data: Partial<InProgressWork>,
  editing: boolean,
  origin?: ButtonPlacement
): HTMLElement {
  return createWorkForm({
    id: WorkAction.IN_PROGRESS,
    landmark: "In Progress Work",
    heading: editing
      ? "Edit in progress work info"
      : "Mark this work as in progress",
    data,
    editing,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and mark as in progress ${data.title || "this work"}`,
      },
      delete: {
        isDeletable: editing === true,
        label: "Stop Reading",
        ariaLabel: `Remove ${
          data.title || "this work"
        } from your in progress list`,
      },
    },
    origin,
  });
}
