import { createWorkForm } from "../base";
import { WorkAction } from "../../config";
import { datetime, number, select, textarea } from "../../../../utils/ui/forms";
import { WorkFormFieldType, WorkFormItem } from "../types";

import { InProgressWork } from "../../../../types/works";
import { ButtonPlacement } from "../../../../enums/settings";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { ReadingStatus } from "../../../../enums/works";
import { getCurrentChapterFromWorkPage } from "../../../../utils/ao3";

const items: WorkFormItem<InProgressWork>[] = [
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
            dataField: "readingStatus",
            label: "Reading Status",
            input: select(ReadingStatus, ReadingStatus.ACTIVE),
          },
          {
            type: WorkFormFieldType.FIELD,
            dataField: "lastReadChapter",
            label: "Last Chapter Read",
            input: number(
              "1",
              getCurrentChapterFromWorkPage({
                suppressWarnings: true,
              })?.toString() || "1"
            ),
          },
        ],
      },
      {
        type: WorkFormFieldType.GROUP,
        className: `${CLASS_PREFIX}__form__pair`,
        fields: [
          {
            type: WorkFormFieldType.FIELD,
            dataField: "startedAt",
            label: "Started Reading On",
            input: datetime(new Date()),
          },
          {
            type: WorkFormFieldType.FIELD,
            dataField: "lastReadAt",
            label: "Last Read On",
            input: datetime(new Date()),
          },
        ],
      },
    ],
  },
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
      ? "Edit Read Progress Info"
      : "Mark this work as In Progress",
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
        label: "Stop Reading",
        ariaLabel: `Remove ${
          data.title || "this work"
        } from your in progress list`,
      },
    },
    origin,
  });
}
