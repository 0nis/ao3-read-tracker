import { CLASS_PREFIX } from "../../../../constants/classes";
import { el } from "../../../../utils/ui/dom";
import { attachExpandableBehavior } from "../helpers/accessibility";
import { createActionButtons } from "../helpers/actions";
import { LIST_CLASS } from "./list.old";

export interface ListRow {
  id: string;
  innerElement: HTMLElement;
  srAccessibleLabel: string;
  srAccessibleContentSummary: string;
  actions?: ListRowActions;
}

export interface ListRowActions {
  link?: {
    href: string;
  };
  delete?: {
    onDelete: () => Promise<void>;
    confirmationText: string;
    successText: string;
  };
}

export async function createListRow({
  id,
  innerElement,
  srAccessibleLabel,
  srAccessibleContentSummary,
  actions = {},
}: ListRow): Promise<HTMLElement> {
  innerElement.setAttribute("aria-hidden", "true");

  const hiddenLabel = el(
    "span",
    {
      id: `${id}-label`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    [srAccessibleLabel]
  );

  const hint = el(
    "span",
    {
      id: `${id}-hint`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    ["Press Enter to show details and actions."]
  );

  const row = el(
    "li",
    {
      id: id,
      className: `${LIST_CLASS}__row`,
      tabIndex: 0,
      attrs: {
        "aria-labelledby": `${id}-label`,
        "aria-describedby": `${id}-label ${id}-hint`,
        "aria-expanded": "false",
      },
    },
    [hiddenLabel, hint, innerElement]
  );

  const actionEls: HTMLElement[] = await createActionButtons(actions, row);
  const actionsWrapper = el(
    "div",
    {
      className: `actions ${LIST_CLASS}__row-actions`,
      attrs: { "aria-hidden": "true" },
    },
    actionEls
  );

  attachExpandableBehavior(
    row,
    innerElement,
    actionsWrapper,
    actionEls,
    srAccessibleContentSummary
  );

  row.appendChild(actionsWrapper);
  return row;
}
