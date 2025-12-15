import { getClass } from "./setup";
import { WorkMetaDetailsList, WorkMetaGroup } from "./types";
import { el } from "../../../utils/ui/dom";

export function addWorkMetaGroupToArea(
  area: HTMLElement,
  group: {
    termEl: HTMLElement;
    descEl: HTMLElement;
  }
): void {
  area.appendChild(group.termEl);
  area.appendChild(group.descEl);
}

export function createWorkMetaGroupElements({
  key,
  label,
  children,
  className,
}: WorkMetaGroup): {
  termEl: HTMLElement;
  descEl: HTMLElement;
} {
  return {
    termEl: el(
      "dt",
      {
        className: `${
          className || ""
        } ${getClass()}-label ${getClass()}--${key}`,
      },
      [`${label}: `]
    ),
    descEl: el(
      "dd",
      { className: `${className || ""} ${getClass()}--${key}` },
      children
    ),
  };
}

export function createWorkMetaDetailsList({
  key,
  items,
}: WorkMetaDetailsList): HTMLElement {
  const itemEls = Object.entries(items).map(([k, i]) => {
    return {
      term: el("dt", { className: `${getClass()}__list-item--${k}` }, [
        `${i.label}:`,
      ]),
      description: el("dd", { className: `${getClass()}__list-item--${k}` }, [
        i.value || "N/A",
      ]),
    };
  });
  const dlChildren: HTMLElement[] = [];
  itemEls.forEach((itemEl) => {
    dlChildren.push(itemEl.term, itemEl.description);
  });
  return el(
    "dl",
    { className: `stats ${getClass()}__list ${getClass()}__list--${key}` },
    dlChildren
  );
}
