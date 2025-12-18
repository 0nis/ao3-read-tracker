import { BlockField } from "./types";
import { buildField, getFields } from "./fields";
import { getSaveElement, onSave } from "./actions/save";
import { getResetElement, onReset } from "./actions/reset";

import { getClass } from "../section";

import { el } from "../../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import { SymbolId } from "../../../../../enums/symbols";
import { SymbolData, SymbolRecord } from "../../../../../types/symbols";

// TODO: Ensure all symbols (the images) use the inline-image class
// TODO: Make sure SVG display works
// TODO: Ensure success messages are displayed within the block itself, not outside, for user friendliness

export type State = {
  file?: Blob;
};

export async function buildBlock(
  id: SymbolId,
  record: SymbolRecord,
  symbols: SymbolData
): Promise<HTMLElement> {
  const state: State = {};

  const header = el("header", {}, [
    el("h4", { className: `${getClass()}__block-title` }, [
      ...(record.emoji ? [renderSymbolContent(record)] : []),
      el("span", {}, [record.label]),
    ]),
  ]);

  const fields: BlockField[] = getFields(id, record, symbols, state);
  const fieldsWrapper = el(
    "ul",
    { className: `${getClass()}__block-fields` },
    fields.map((field) => buildField(field))
  );

  const notificationEl = el("p", {
    className: `${getClass()}__block-notification`,
    attrs: { "aria-live": "polite" },
  });

  const bottom = el("div", { className: `${getClass()}__block-bottom` }, [
    notificationEl,
    el("ul", { className: `${getClass()}__block-actions` }, [
      getResetElement(() => onReset({ id, fields, state, notificationEl })),
      getSaveElement(() => onSave({ id, fields, state, notificationEl })),
    ]),
  ]);

  return el(
    "li",
    {
      id: `symbol-${id}`,
      className: `${getClass()}__block`,
    },
    [header, fieldsWrapper, bottom]
  );
}
