import { createWorkForm } from "../base";
import { WorkAction } from "../../config";
import {
  checkbox,
  datetime,
  number,
  select,
  textarea,
} from "../helpers/inputs";
import { WorkFormFieldType, WorkFormItem } from "../types";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { ReadWork } from "../../../../types/works";
import { ButtonPlacement } from "../../../../enums/settings";
import { FinishedStatus } from "../../../../enums/works";

const items: WorkFormItem<ReadWork>[] = [
  {
    type: WorkFormFieldType.FIELD,
    dataField: "notes",
    label: "Notes",
    description:
      "Private notes that will appear in the work summary block for this work.",
    input: textarea(3),
  },
  {
    type: WorkFormFieldType.GROUP,
    className: `${CLASS_PREFIX}__form__group`,
    fields: [
      {
        type: WorkFormFieldType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: WorkFormFieldType.FIELD,
            dataField: "finishedAt",
            label: "Finished at",
            input: datetime(new Date()),
          },
          {
            type: WorkFormFieldType.FIELD,
            dataField: "finishedStatus",
            label: "Status",
            input: select(FinishedStatus, FinishedStatus.COMPLETED),
          },
        ],
      },
      {
        type: WorkFormFieldType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: WorkFormFieldType.FIELD,
            dataField: "timesRead",
            label: "Times read",
            input: number("1", "1"),
          },
          {
            type: WorkFormFieldType.FIELD,
            dataField: "rereadWorthy",
            label: "Re-read worthy?",
            input: checkbox(),
          },
        ],
      },
    ],
  },
];

export function createReadWorkForm(
  data: Partial<ReadWork>,
  editing: boolean,
  origin?: ButtonPlacement
): HTMLElement {
  return createWorkForm({
    id: WorkAction.READ,
    landmark: "Mark Work as Read",
    heading: editing ? "Edit read work info!" : "Mark this work as read!",
    data,
    editing,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and mark ${data.title || "this work"} as read`,
      },
      delete: {
        isDeletable: editing === true,
        label: "Mark as Unread",
        ariaLabel: `Remove ${data.title || "this work"} from your read list`,
      },
    },
    origin,
  });
}
