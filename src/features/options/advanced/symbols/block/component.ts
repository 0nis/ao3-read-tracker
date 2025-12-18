import { BlockContext, BlockField, State } from "./types";
import { buildField, getFields } from "./fields";
import { getSaveElement, onSave } from "./actions/save";
import { getResetElement, onReset } from "./actions/reset";
import { getClass } from "../section";

import { el } from "../../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../../utils/ui/symbols";
import { SymbolId } from "../../../../../enums/symbols";
import { SymbolData, SymbolRecord } from "../../../../../types/symbols";

export async function buildBlock(
  id: SymbolId,
  record: SymbolRecord,
  symbols: SymbolData
): Promise<HTMLElement> {
  const state: State = {};
  const context: BlockContext = { id, record, state, symbols };

  const headerEl = el("header", {}, [
    el("h4", { className: `${getClass()}__block-title` }, [
      ...(record.emoji ? [renderSymbolContent(record)] : []),
      el("span", {}, [record.label]),
    ]),
  ]);

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
