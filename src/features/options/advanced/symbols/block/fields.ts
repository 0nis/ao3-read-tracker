import { State } from "./component";
import { getLabelFromType } from "./helpers";
import { BlockField } from "./types";
import { getClass, ACCEPTED_IMAGE_TYPES } from "../section";

import { el } from "../../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import {
  getImageSelectorElements,
  getInputElement,
  number,
  text,
} from "../../../../../utils/ui/forms";
import { SymbolId } from "../../../../../enums/symbols";
import { ABBREVIATION } from "../../../../../constants/global";
import { SymbolData, SymbolRecord } from "../../../../../types/symbols";

export function getFields(
  id: SymbolId,
  record: SymbolRecord,
  symbols: SymbolData,
  state: State
): BlockField[] {
  const imgSelectorEls = getImageSelectorElements({
    defaultImg: record.imgBlob,
    upload: {
      label: "Upload",
    },
    clear: {
      label: renderSymbolContent(symbols[SymbolId.CLEAR]),
    },
    onChange: (blob) => (state.file = blob ?? undefined),
    accept: ACCEPTED_IMAGE_TYPES,
  });

  state.file = record.imgBlob;
  document.addEventListener(`${ABBREVIATION}:symbol-record-updated`, (e) => {
    const details = (e as CustomEvent).detail;
    if (details.id !== id) return;
    state.file = details.imgBlob;
    imgSelectorEls.update(details.imgBlob);
  });

  return [
    { id, type: "label", element: text(record.label) },
    {
      id,
      type: "imgBlob",
      element: el(
        "div",
        { className: `${getClass()}__block__field-input--upload` },
        [
          el(
            "div",
            { className: `${getClass()}__block__field-input--upload-group` },
            [imgSelectorEls.uploadBtn, imgSelectorEls.preview]
          ),
          imgSelectorEls.clearBtn,
          imgSelectorEls.input,
        ]
      ),
    },
    { id, type: "emoji", element: text(record.emoji ?? "") },
    { id, type: "priority", element: number("0", record.priority.toString()) },
  ];
}

export function buildField({ id, type, element }: BlockField): HTMLElement {
  const inputEl = getInputElement(element) ?? element;
  inputEl.id = `symbol-${id}-${type}`;
  inputEl.setAttribute("data-field", type);
  element.classList.add(`${getClass()}__block__field-input`);

  return el("div", { className: `${getClass()}__block__field` }, [
    el(
      "label",
      {
        className: `${getClass()}__block__field-label`,
        htmlFor: `symbol-${id}-${type}`,
      },
      [getLabelFromType(type)]
    ),
    element,
  ]);
}
