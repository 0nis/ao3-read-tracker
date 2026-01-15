import { getLabelFromType, setFeedback } from "./helpers";
import { BlockContext, BlockField } from "./types";
import { getClass, ACCEPTED_IMAGE_TYPES } from "../../../section";

import { el } from "../../../../../../../../utils/ui/dom";
import { renderSymbolContentById } from "../../../../../../../../utils/ui/symbols";
import {
  getImageSelectorElements,
  getInputElement,
  number,
  text,
} from "../../../../../../../../utils/ui/forms";
import { SymbolId } from "../../../../../../../../enums/symbols";
import {
  ABBREVIATION,
  DEFAULT_SYMBOL_SIZE_EM,
} from "../../../../../../../../constants/global";

export async function getFields({
  id,
  record,
  symbols,
  state,
  feedbackEl,
}: BlockContext): Promise<BlockField[]> {
  const imgSelectorEls = getImageSelectorElements({
    defaultImg: record.imgBlob,
    upload: {
      label: "Upload",
    },
    clear: {
      label: await renderSymbolContentById(SymbolId.CLEAR, "Clear", {
        sizeOverride: DEFAULT_SYMBOL_SIZE_EM,
      }),
    },
    onChange: (blob) => (state.file = blob ?? undefined),
    onError: (message) => {
      if (feedbackEl) setFeedback("error", message, feedbackEl);
    },
    accept: ACCEPTED_IMAGE_TYPES,
  });

  state.file = record.imgBlob;
  document.addEventListener(`${ABBREVIATION}:symbol-updated`, (e) => {
    const record = (e as CustomEvent).detail.record;
    if (record.id !== id) return;
    imgSelectorEls.update(record.imgBlob);
  });

  return [
    { id, type: "label", element: text({ defaultValue: record.label }) },
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
    { id, type: "emoji", element: text({ defaultValue: record.emoji ?? "" }) },
    {
      id,
      type: "priority",
      element: number({ defaultValue: record.priority }),
    },
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
