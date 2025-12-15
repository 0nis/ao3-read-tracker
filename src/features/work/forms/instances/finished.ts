import { createWorkForm } from "../base";
import { WorkFormItem } from "../types";
import { WorkAction } from "../../config";

import {
  datetime,
  number,
  enumSelect,
  textarea,
  toggleSwitch,
} from "../../../../utils/ui/forms";
import { VerticalPlacement } from "../../../../enums/settings";
import { FinishedStatus } from "../../../../enums/works";
import { FormItemType } from "../../../../enums/forms";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { FinishedWork } from "../../../../types/works";

const items: WorkFormItem<FinishedWork>[] = [
  {
    type: FormItemType.FIELD,
    dataField: "notes",
    label: "Notes",
    description:
      "Private notes that will appear in the work summary block for this work.",
    input: textarea(3),
  },
  {
    type: FormItemType.GROUP,
    className: `${CLASS_PREFIX}__form__group`,
    fields: [
      {
        type: FormItemType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: FormItemType.FIELD,
            dataField: "finishedAt",
            label: "Finished at",
            input: datetime(new Date()),
          },
          {
            type: FormItemType.FIELD,
            dataField: "finishedStatus",
            label: "Status",
            input: enumSelect(FinishedStatus, FinishedStatus.COMPLETED),
          },
        ],
      },
      {
        type: FormItemType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: FormItemType.FIELD,
            dataField: "timesRead",
            label: "Times read",
            input: number("1", "1"),
          },
          {
            type: FormItemType.FIELD,
            dataField: "rereadWorthy",
            label: "Reread worthy?",
            input: toggleSwitch(),
          },
        ],
      },
    ],
  },
];

export function createFinishedWorkForm(
  data: Partial<FinishedWork>,
  editing: boolean,
  origin?: VerticalPlacement
): HTMLElement {
  return createWorkForm({
    id: WorkAction.FINISHED,
    landmark: "Mark Work as Raed",
    heading: editing ? "Edit finished work info!" : "Mark this work as read!",
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
        ariaLabel: `Remove ${
          data.title || "this work"
        } from your finished list`,
      },
    },
    origin,
  });
}
