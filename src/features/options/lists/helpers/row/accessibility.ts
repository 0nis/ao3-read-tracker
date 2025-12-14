import { CLASS_PREFIX } from "../../../../../constants/classes";
import { reportSrLive } from "../../../../../utils/ui/accessibility";
import { el } from "../../../../../utils/ui/dom";
import { SupplementaryRowInformation } from "../../types";

export function getSrAccessibleContentSummary({
  symbols,
  text,
  status,
}: SupplementaryRowInformation): string {
  const descriptions: string[] = [];
  if (symbols?.data && symbols?.rules) {
    for (const rule of symbols.rules) {
      const label = rule.getCustomLabel?.() || symbols.data[rule.id]?.label;
      if (label) descriptions.push(label);
    }
  }
  if (text) descriptions.push(text);
  if (status) descriptions.push(`status: ${status}`);
  return descriptions.length ? `${descriptions.join(", ")}.` : "";
}

export function attachExpandableBehavior(
  row: HTMLElement,
  innerEl: HTMLElement,
  actionsWrapper: HTMLElement,
  actionEls: HTMLElement[],
  srContentSummary: string
) {
  function collapse() {
    row.setAttribute("aria-expanded", "false");
    innerEl.setAttribute("aria-hidden", "true");
    actionsWrapper.setAttribute("aria-hidden", "true");
    actionEls.forEach((btn) => (btn.tabIndex = -1));
  }

  function expand() {
    row.setAttribute("aria-expanded", "true");
    innerEl.setAttribute("aria-hidden", "false");
    actionsWrapper.setAttribute("aria-hidden", "false");
    actionEls.forEach((btn) => (btn.tabIndex = 0));
    reportSrLive(srContentSummary);
  }

  actionEls.forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });

  row.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      collapse();
    }
  });

  row.addEventListener("click", () => {
    const isExpanded = row.getAttribute("aria-expanded") === "true";
    if (isExpanded) collapse();
    else expand();
  });

  row.addEventListener(
    "blur",
    (e: FocusEvent) => {
      const next = e.relatedTarget;
      if (!(next instanceof Node) || !row.contains(next)) {
        collapse();
      }
    },
    true
  );

  return { collapse, expand };
}

export function getAccessibleLabels(
  id: string,
  label: string
): {
  hiddenLabel: HTMLElement;
  hint: HTMLElement;
} {
  const hiddenLabel = el(
    "span",
    {
      id: `${id}-label`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    [label]
  );

  const hint = el(
    "span",
    {
      id: `${id}-hint`,
      className: `${CLASS_PREFIX}__sr-only`,
    },
    ["Press Enter to show details and actions."]
  );

  return { hiddenLabel, hint };
}
