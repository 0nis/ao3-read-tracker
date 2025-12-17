import { getLabelFromType } from "./helpers";
import { BlockField } from "./types";

import { getClass } from "../section";

import { el } from "../../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import {
  imageSelector,
  getInputElement,
  number,
  text,
} from "../../../../../utils/ui/forms";

import { SymbolId } from "../../../../../enums/symbols";
import { SymbolRecord } from "../../../../../types/symbols";

export function buildBlock(id: SymbolId, record: SymbolRecord): HTMLElement {
  const fields: BlockField[] = [
    { id, type: "label", element: text(record.label) },
    { id, type: "priority", element: number("0", record.priority.toString()) },
    { id, type: "emoji", element: text(record.emoji ?? "") },
    {
      id,
      type: "imgBlob",
      element: imageSelector({
        label: "Upload image",
        onChange: () => {
          // TODO: implement
          console.log("TODO");
        },
        defaultValue: record.imgBlob,
      }),
    },
  ];

  const header = el("header", {}, [
    el("h4", { className: `${getClass()}__block-title` }, [
      ...(record.emoji ? [renderSymbolContent(record)] : []),
      el("span", {}, [record.label]),
    ]),
  ]);

  const fieldsWrapper = el("ul", { className: `${getClass()}__block-fields` }, [
    ...fields.map((field) => buildField(field)),
  ]);

  return el(
    "li",
    {
      id: `symbol-${id}`,
      className: `${getClass()}__block`,
    },
    [header, fieldsWrapper]
  );
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
