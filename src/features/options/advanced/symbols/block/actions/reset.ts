import { State } from "../component";
import { onSave } from "./save";
import { BlockField } from "../types";
import { getClass } from "../../section";

import { el } from "../../../../../../utils/ui/dom";
import { setInputValue } from "../../../../../../utils/ui/forms";
import { SymbolId } from "../../../../../../enums/symbols";
import { CLASS_PREFIX } from "../../../../../../constants/classes";
import { DEFAULT_SYMBOL_RECORDS } from "../../../../../../constants/symbols";
import { ABBREVIATION } from "../../../../../../constants/global";

export function getResetElement(onReset: () => void) {
  const resetEl = el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger ${getClass()}__block-actions--reset`,
    },
    ["Reset"]
  );
  resetEl.addEventListener("click", () => onReset());
  return resetEl;
}

export async function onReset(
  id: SymbolId,
  fields: BlockField[],
  state: State
) {
  const confirmed = confirm(
    "Are you sure you want to reset this symbol to its default values?"
  );
  if (confirmed) {
    const defaultValue = DEFAULT_SYMBOL_RECORDS.find((s) => s.id === id)!;
    fields.forEach((field) => {
      setInputValue(field.element, defaultValue[field.type]);
    });
    state.file = defaultValue.imgBlob;
    await onSave(id, fields, state);
    document.dispatchEvent(
      new CustomEvent(`${ABBREVIATION}:symbol-record-updated`, {
        detail: {
          id,
          imgBlob: defaultValue.imgBlob,
        },
      })
    );
  }
}
