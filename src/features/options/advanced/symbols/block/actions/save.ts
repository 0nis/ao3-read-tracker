import { BlockField } from "../types";
import { State } from "../component";
import { getClass } from "../../section";

import { StorageService } from "../../../../../../services/storage";
import { el } from "../../../../../../utils/ui/dom";
import { handleStorageWrite } from "../../../../../../utils/storage";
import { getInputValue } from "../../../../../../utils/ui/forms";

import { SymbolId } from "../../../../../../enums/symbols";
import { CLASS_PREFIX } from "../../../../../../constants/classes";
import { SymbolRecord } from "../../../../../../types/symbols";

export function getSaveElement(onSave: () => void) {
  const saveEl = el(
    "button",
    { className: `${CLASS_PREFIX}__button ${getClass()}__block-actions--save` },
    ["Save"]
  );
  saveEl.addEventListener("click", () => onSave());
  return saveEl;
}

export async function onSave(id: SymbolId, fields: BlockField[], state: State) {
  const data: Partial<SymbolRecord> = { id };
  fields.forEach((field) => {
    data[field.type] = getInputValue(field.element);
  });
  data["imgBlob"] = state.file ?? undefined;
  await handleStorageWrite(
    StorageService.symbolRecords.put(data as SymbolRecord),
    {
      successMsg: "Changes saved successfully.",
      errorMsg: "Failed to save changes.",
    }
  );
}
