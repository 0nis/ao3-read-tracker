import { CLASS_PREFIX } from "../../../constants/classes";
import { el, ensureChild, injectStyles } from "../../../utils/ui/dom";

/**
 * A tiny piece of text added right above the work listing used for
 * displaying status information about the listing as a whole.
 */
export function addStatusElement(child: HTMLElement | null): void {
  if (!child) return;
  const ol = document.querySelector(".work.index.group") as HTMLElement | null;
  if (!ol) return;
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-status`,
    getStyles(CLASS_PREFIX)
  );
  const status = ensureChild({
    parent: ol,
    className: `${CLASS_PREFIX}__listing-status`,
    tag: "div",
    prepend: true,
  });
  status.appendChild(child);
}

/**
 * An {@link addStatusElement} child showing how many works are
 * currently hidden in the listing due to user settings.
 */
export function createHiddenWorksCountEl(
  modifiedWorks: NodeListOf<HTMLElement>
): HTMLElement | null {
  const count = countHiddenWorks(modifiedWorks);
  if (count === 0) return null;
  return el(
    "p",
    {
      className: `${CLASS_PREFIX}__listing-status__item ${CLASS_PREFIX}__listing-status__item--hidden-works`,
      attrs: { "aria-live": "polite" },
    },
    `${count} ${count === 1 ? "work" : "works"} hidden`
  );
}

function countHiddenWorks(elements: NodeListOf<HTMLElement>): number {
  return Array.from(elements).filter((element) =>
    element.classList.contains(`${CLASS_PREFIX}__hidden--work-listing`)
  ).length;
}

function getStyles(prefix: string): string {
  return `
    .${prefix}__listing-status {
      text-align: right;
      font-size: 0.85em;
      margin-bottom: 0.5em;
      font-style: italic;
      color: inherit;
    }
  `;
}
