import { onSave } from "./save";
import { BlockContext } from "../types";
import { getClass } from "../../../../section";

import { el } from "../../../../../../../../utils/dom";
import { setInputValue } from "../../../../../../../../utils/ui/forms";
import { CLASS_PREFIX } from "../../../../../../../../constants/classes";
import { DEFAULT_SYMBOL_RECORDS } from "../../../../../../../../constants/symbols";
import { ABBREVIATION } from "../../../../../../../../constants/global";

export function getResetElement(onReset: () => void) {
  const resetEl = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger ${getClass()}__block-actions--reset`,
    },
    ["Reset"],
  );
  resetEl.addEventListener("click", () => onReset());
  return resetEl;
}

export async function onReset(context: BlockContext) {
  if (!context.fields) return;
  const confirmed = confirm(
    "Are you sure you want to reset this symbol to its default values?",
  );
  if (confirmed) {
    const defaultValue = DEFAULT_SYMBOL_RECORDS.find(
      (s) => s.id === context.id,
    )!;
    context.fields.forEach((field) => {
      setInputValue(field.element, defaultValue[field.type]);
    });
    context.state.file = defaultValue.imgBlob;
    await onSave({
      ...context,
      successMsg: "Successfully reset to default values.",
    });
  }
}
