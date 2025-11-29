import { createWorkForm } from "../base";
import { FormId } from "../config";
import { getItemFromWorkFormItemArray } from "../helpers/items";
import { checkbox, number, textarea } from "../inputs";
import { WorkFormFieldType, WorkFormItem } from "../types";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { ReadWork } from "../../../../types/works";
import { getCurrentChapterFromWorkPage } from "../../../../utils/ao3";

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
    type: WorkFormFieldType.FIELD,
    dataField: "count",
    label: "Times read",
    description: "The number of times you've read this work.",
    input: number("1"),
  },
  {
    type: WorkFormFieldType.GROUP,
    className: `${CLASS_PREFIX}__align-horizontally`,
    fields: [
      {
        type: WorkFormFieldType.FIELD,
        dataField: "rereadWorthy",
        label: "Re-read worthy?",
        input: checkbox(),
      },
      {
        type: WorkFormFieldType.FIELD,
        dataField: "isReading",
        label: "Still reading?",
        input: checkbox(),
      },
      {
        type: WorkFormFieldType.FIELD,
        dataField: "lastReadChapter",
        label: "Last read chapter",
        input: number("1"),
      },
    ],
  },
];

export function createReadWorkForm(
  data: Partial<ReadWork>,
  editing?: boolean
): HTMLElement {
  wireIsReadingBehavior(
    getItemFromWorkFormItemArray("isReading", items)?.input as HTMLInputElement,
    getItemFromWorkFormItemArray("lastReadChapter", items)
      ?.input as HTMLInputElement
  );

  return createWorkForm<ReadWork>({
    id: FormId.READ_WORK,
    landmark: "Mark Work as Read",
    heading: editing ? "Edit read work info!" : "Mark this work as read!",
    data,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and mark ${data.title || "this work"} as read`,
      },
      delete: {
        isDeletable: false,
        label: "Mark as Unread",
        ariaLabel: `Remove ${data.title || "this work"} from your read list`,
      },
    },
  });
}

function wireIsReadingBehavior(
  isReadingInput: HTMLInputElement,
  lastReadChapterInput: HTMLInputElement
) {
  if (!isReadingInput || !lastReadChapterInput) return;

  const handleChange = () => {
    if (isReadingInput.checked) {
      const ch = getCurrentChapterFromWorkPage();
      if (ch !== null) lastReadChapterInput.value = ch.toString();
      lastReadChapterInput.disabled = false;
    } else {
      lastReadChapterInput.value = "";
      lastReadChapterInput.disabled = true;
    }
  };

  isReadingInput.addEventListener("change", handleChange);
  handleChange();
}
