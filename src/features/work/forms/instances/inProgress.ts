import { createWorkForm } from "../base";
import { WorkFormItem } from "../types";
import { WorkAction } from "../../config";
import { getCurrentChapterFromWorkPage } from "../../helpers";

import { settingsCache } from "../../../../services/cache";
import { datetime, number, enumSelect, textarea } from "../../../../ui/forms";
import { FormItemType } from "../../../../ui/forms/enums";
import { VerticalPlacement } from "../../../../enums/settings";
import { ReadingStatus } from "../../../../enums/works";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { InProgressWork } from "../../../../types/works";

const items: WorkFormItem<InProgressWork>[] = [
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
            dataField: "readingStatus",
            label: "Reading Status",
            input: enumSelect(ReadingStatus, ReadingStatus.ACTIVE),
          },
          {
            type: FormItemType.FIELD,
            dataField: "lastReadChapter",
            label: "Last Chapter Read",
            input: number({
              min: 1,
              defaultValue:
                getCurrentChapterFromWorkPage({
                  suppressWarnings: true,
                }) || 1,
            }),
          },
        ],
      },
      {
        type: FormItemType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: FormItemType.FIELD,
            dataField: "startedAt",
            label: "Started Reading On",
            input: datetime({ defaultValue: new Date() }),
          },
          {
            type: FormItemType.FIELD,
            dataField: "lastReadAt",
            label: "Last Read On",
            input: datetime({ defaultValue: new Date() }),
          },
        ],
      },
    ],
  },
];

export async function createInProgressWorkForm(
  data: Partial<InProgressWork>,
  editing: boolean,
  origin?: VerticalPlacement,
): Promise<HTMLElement> {
  const { labelSettings } = await settingsCache.get();
  return createWorkForm({
    id: WorkAction.IN_PROGRESS,
    landmark: editing ? "Edit Read Progress" : "Start Reading",
    heading: editing ? "Edit Read Progress" : "Start Reading This Work",
    data,
    editing,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and add ${
          data.title || "this work"
        } to your in progress list`,
      },
      delete: {
        isDeletable: editing === true,
        label: labelSettings.actions.in_progress.simple.on,
        ariaLabel: `Remove ${
          data.title || "this work"
        } from your in progress list`,
      },
    },
    origin,
  });
}
