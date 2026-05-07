import { createWorkForm } from "../base";
import { WorkFormItem } from "../types";
import { WorkAction } from "../../config";

import { settingsCache } from "../../../../services/cache";
import {
  datetime,
  number,
  enumSelect,
  textarea,
  toggleSwitch,
} from "../../../../ui/forms";
import { FormItemType } from "../../../../ui/forms/enums";
import { VerticalPlacement } from "../../../../enums/settings";
import { FinishedStatus } from "../../../../enums/works";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { FinishedWork } from "../../../../types/works";

const items: WorkFormItem<FinishedWork>[] = [
  {
    type: FormItemType.FIELD,
    dataField: "notes",
    label: "Notes",
    description:
      "Private notes that will appear in the work summary block for this work.",
    input: textarea({ rows: 3 }),
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
            label: "Finished At",
            input: datetime({ defaultValue: new Date() }),
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
            label: "Times Read",
            input: number({ min: 1, defaultValue: 1 }),
          },
          {
            type: FormItemType.FIELD,
            dataField: "rereadWorthy",
            label: "Reread Worthy?",
            input: toggleSwitch(),
          },
        ],
      },
    ],
  },
];

export async function createFinishedWorkForm(
  data: Partial<FinishedWork>,
  editing: boolean,
  origin?: VerticalPlacement,
): Promise<HTMLElement> {
  const { labelSettings } = await settingsCache.get();
  return createWorkForm({
    id: WorkAction.FINISHED,
    landmark: editing ? "Edit Finished Work" : "Mark This Work as Read",
    heading: editing ? "Edit Finished Work" : "Mark This Work as Read",
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
        label: labelSettings.actions.finished.simple.on,
        ariaLabel: `Remove ${
          data.title || "this work"
        } from your finished list`,
      },
    },
    origin,
  });
}
