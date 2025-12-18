import { BlockContext, BlockField, State } from "./types";
import { buildField, getFields } from "./fields";
import { getSaveElement, onSave } from "./actions/save";
import { getResetElement, onReset } from "./actions/reset";
import { getClass } from "../section";

import { el } from "../../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import { SymbolId } from "../../../../../enums/symbols";
import { ABBREVIATION } from "../../../../../constants/global";
import { SymbolData, SymbolRecord } from "../../../../../types/symbols";

export async function buildBlock(
  id: SymbolId,
  record: SymbolRecord,
  symbols: SymbolData
): Promise<HTMLElement> {
  const state: State = {};
  const context: BlockContext = { id, record, state, symbols };

  const headerEl = el("header", {}, [
    el(
      "h4",
      { className: `${getClass()}__block-title` },
      getTitleChildren(record)
    ),
  ]);

  document.addEventListener(`${ABBREVIATION}:symbol-updated`, (e) => {
    const record = (e as CustomEvent).detail.record;
    if (record.id !== id) return;
    headerEl.querySelector("h4")?.replaceChildren(...getTitleChildren(record));
  });

  context.feedbackEl = el("p", {
    className: `${getClass()}__block-feedback`,
    attrs: { "aria-live": "polite" },
  });

  const fields: BlockField[] = getFields(context);
  context.fields = fields;
  const fieldsWrapper = el(
    "ul",
    { className: `${getClass()}__block-fields` },
    fields.map((field) => buildField(field))
  );

  const bottomEl = el("div", { className: `${getClass()}__block-bottom` }, [
    context.feedbackEl,
    el("ul", { className: `${getClass()}__block-actions` }, [
      getResetElement(() => onReset(context)),
      getSaveElement(() => onSave(context)),
    ]),
  ]);

  return el(
    "li",
    {
      id: `symbol-${id}`,
      className: `${getClass()}__block`,
    },
    [headerEl, fieldsWrapper, bottomEl]
  );
}

function getTitleChildren(record: SymbolRecord) {
  const children: HTMLElement[] = [];

  if (record.emoji || record.imgBlob)
    children.push(renderSymbolContent(record));
  if (record.label) children.push(el("span", {}, [record.label]));

  // In case someone just deletes everything from the record
  if (!record.emoji && !record.imgBlob && !record.label)
    children.push(el("span", {}, [`ID: ${record.id}`]));

  return children;
}
