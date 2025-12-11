import { getWorkLinkFromId } from "../../../../utils/ao3";
import { capitalizeFirstLetter } from "../../../../utils/string";
import { handleStorageWrite } from "../../../../utils/storage";
import { showConfirm } from "../../../../utils/ui/dialogs";
import { el } from "../../../../utils/ui/dom";
import { getWorkTitleForNotifications } from "../../../work/helpers";
import {
  LIST_ROW_MESSAGES_MAP,
  LIST_ROW_TYPE_SERVICE_MAP,
  ListRowType,
  ListRowTypeMap,
} from "../config";
import {
  attachExpandableBehavior,
  getAccessibleLabels,
  getSrAccessibleContentSummary,
} from "../helpers/row/accessibility";
import { createDeleteBtn, createLinkBtn } from "../helpers/row/actions";
import { createSymbolElement } from "../helpers/row/symbols";
import { SupplementaryRowInformation } from "../types";
import { getListClass } from "./list";

export interface ListRow<T extends keyof ListRowTypeMap> {
  type: T;
  item: ListRowTypeMap[T];
  info: SupplementaryRowInformation;
}

export async function createListRow<T extends keyof ListRowTypeMap>({
  type,
  item,
  info,
}: ListRow<T>): Promise<HTMLElement> {
  const innerEl = await createInnerElement({ item, ...info });
  const srContentSummary = getSrAccessibleContentSummary(info);
  const messages = LIST_ROW_MESSAGES_MAP[type];

  innerEl.setAttribute("aria-hidden", "true");
  const { hiddenLabel, hint } = getAccessibleLabels(
    item.id,
    messages.srAccessibleLabel.replace("%title%", item.title || "Untitled")
  );

  const row = el(
    "li",
    {
      id: item.id,
      className: `${getListClass()}__row`,
      tabIndex: 0,
      attrs: {
        "aria-labelledby": `${hiddenLabel.id}`,
        "aria-describedby": `${hiddenLabel.id} ${hint.id}`,
        "aria-expanded": "false",
      },
    },
    [hiddenLabel, hint, innerEl]
  );

  const actionEls: HTMLElement[] = await createActionButtons(
    item.id,
    getWorkTitleForNotifications(item.title),
    type,
    row
  );
  const actionsWrapper = el(
    "div",
    {
      className: `actions ${getListClass()}__row-actions`,
      attrs: { "aria-hidden": "true" },
    },
    actionEls
  );

  // prettier-ignore
  attachExpandableBehavior(row, innerEl, actionsWrapper, actionEls, srContentSummary);

  row.appendChild(actionsWrapper);
  return row;
}

async function createInnerElement({
  item,
  symbols,
  text,
  date,
  status,
}: SupplementaryRowInformation & {
  item: ListRowTypeMap[keyof ListRowTypeMap];
}): Promise<HTMLElement> {
  if (!item)
    return el("div", { className: `${getListClass()}__row-content` }, [
      "Item not found",
    ]);
  const mainEls: HTMLElement[] = [];
  const infoEls: HTMLElement[] = [];

  // Title
  mainEls.push(
    el(
      "p",
      { className: `${getListClass()}__row-title` },
      item.title || "untitled"
    )
  );

  // Reason, note, etc.
  if (text) {
    mainEls.push(
      el("p", { className: `${getListClass()}__row-main--text` }, text)
    );
  }

  // TODO: Make configurable whether they show up or not. Just use local storage for that
  // Symbols
  if (symbols?.data && symbols?.rules) {
    const filteredRules = symbols.rules.filter(
      (rule) => !symbols.exclude?.includes(rule.id)
    );
    const symbolsElement = await createSymbolElement(
      symbols.data,
      filteredRules
    );
    infoEls.push(symbolsElement);
  }

  // TODO: Make configurable whether this shows up or not. Again just use local storage
  // Status
  if (status)
    infoEls.push(
      el(
        "p",
        { className: `${getListClass()}__row-main--info--status` },
        capitalizeFirstLetter(status)
      )
    );

  if (infoEls.length > 0)
    mainEls.push(
      el("div", { className: `${getListClass()}__row-main--info` }, infoEls)
    );

  return el("div", { className: `${getListClass()}__row-content` }, [
    el("span", { className: `${getListClass()}__row-date` }, date),
    el("div", { className: `${getListClass()}__row-main` }, mainEls),
  ]);
}

async function createActionButtons(
  itemId: string,
  title: string,
  type: ListRowType,
  row: HTMLElement
): Promise<HTMLElement[]> {
  const buttonPromises: Promise<HTMLElement>[] = [];

  buttonPromises.push(createLinkBtn(getWorkLinkFromId(itemId)));

  const services = LIST_ROW_TYPE_SERVICE_MAP[type];
  const messages = LIST_ROW_MESSAGES_MAP[type];

  const replace = (str: string) => str.replace("%title%", title);

  buttonPromises.push(
    createDeleteBtn(() => {
      const confirmed = showConfirm(
        replace(messages.delete.confirmation) ||
          "Are you sure you want to delete this item?"
      );
      if (!confirmed) return;

      handleStorageWrite(services.deleter(itemId), {
        successMsg: replace(messages.delete.success),
        errorMsg: replace(messages.delete.error),
      }).then(() => {
        row.remove();
      });
    })
  );

  return Promise.all(buttonPromises);
}
