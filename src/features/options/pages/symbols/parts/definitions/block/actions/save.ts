import { BlockContext } from "../types";
import { setFeedback } from "../helpers";
import { getClass } from "../../../../section";

import { StorageService } from "../../../../../../../../services/storage/storage";
import { el } from "../../../../../../../../utils/dom";
import { handleStorageWrite } from "../../../../../../../../shared/storage/handlers";
import { getInputValue } from "../../../../../../../../ui/forms";
import { CLASS_PREFIX } from "../../../../../../../../constants/classes";
import { ABBREVIATION } from "../../../../../../../../constants/global";
import { SymbolRecord } from "../../../../../../../../types/symbols";

export function getSaveElement(onSave: () => void) {
  const saveEl = el(
    "button",
    { className: `${CLASS_PREFIX}__button ${getClass()}__block-actions--save` },
    ["Save"],
  );
  saveEl.addEventListener("click", () => onSave());
  return saveEl;
}

export async function onSave({
  id,
  fields,
  state,
  feedbackEl,
  successMsg,
}: BlockContext & { successMsg?: string }) {
  if (!fields) return;
  const data: Partial<SymbolRecord> = { id };
  fields.forEach((field) => {
    data[field.type] = getInputValue(field.element);
  });
  if (!data.priority) data.priority = 0; // Otherwise it'll disappear from the UI lol

  data["imgBlob"] = state.file ?? undefined;
  await handleStorageWrite(
    StorageService.symbolRecords.put(data as SymbolRecord),
    {
      successMsg: successMsg || "Changes saved successfully",
      errorMsg: "Failed to save changes",
      onSuccess(message) {
        if (feedbackEl) setFeedback("success", message, feedbackEl);
      },
      onError(message) {
        if (feedbackEl) setFeedback("error", message, feedbackEl);
      },
    },
  );
  document.dispatchEvent(
    new CustomEvent(`${ABBREVIATION}:symbol-updated`, {
      detail: {
        record: data as SymbolRecord,
      },
    }),
  );
}
