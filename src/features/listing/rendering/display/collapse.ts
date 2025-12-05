import { CLASS_PREFIX } from "../../../../constants/classes";
import { CollapseMode } from "../../../../enums/ui";
import { el, getElement, injectStyles } from "../../../../utils/ui/dom";
import { getWork } from "../../handlers";

/**
 * Hides the details of a work in the listing to take up less space.
 * Adds a toggle to show/hide details again as needed.
 *
 * - {@link CollapseMode.GENTLE} leaves the header visible
 * - {@link CollapseMode.AGGRESSIVE} hides everything except the text indicator and toggle button
 */
export function collapse(mode: CollapseMode, workOrId: HTMLElement | string) {
  const work = getWork(workOrId);
  if (!work) return;
  const isCollapsed = work.classList.contains(`${CLASS_PREFIX}__collapsed`);
  if (isCollapsed) return;

  work.appendChild(createClearSpacer());
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-collapse`,
    getStyles(CLASS_PREFIX)
  );

  const header = work.querySelector<HTMLElement>(".header.module");
  const textIndicator = work.querySelector<HTMLElement>(
    `.${CLASS_PREFIX}__text-indicator`
  );

  const elementsToHide = Array.from(work.children).filter((child) => {
    if (child === textIndicator) return false;
    if (mode === CollapseMode.GENTLE && child === header) return false;
    return true;
  });

  work.classList.add(
    `${CLASS_PREFIX}__collapsed`,
    `${CLASS_PREFIX}__collapsed--${mode}`
  );
  for (const el of elementsToHide) {
    el.classList.add(`${CLASS_PREFIX}__hidden`);
    el.setAttribute("aria-hidden", "true");
  }

  const toggle = createCollapseToggle(work, elementsToHide, true);
  work.appendChild(toggle);
}

/**
 * Removes collapsing logic from a work in the listing, showing all details again.
 * NOT USED FOR TOGGLING! {@link createCollapseToggle} is used for that.
 */
export function unCollapse(workOrId: HTMLElement | string) {
  const work = getWork(workOrId);
  if (!work) return;
  if (!work.classList.contains(`${CLASS_PREFIX}__collapsed`)) return;
  work.classList.remove(
    `${CLASS_PREFIX}__collapsed`,
    `${CLASS_PREFIX}__collapsed--${CollapseMode.GENTLE}`,
    `${CLASS_PREFIX}__collapsed--${CollapseMode.AGGRESSIVE}`
  );
  const elementsToRemove = [
    getElement(work, `.${CLASS_PREFIX}__collapsed__toggle`),
    getElement(work, `.${CLASS_PREFIX}__collapsed__spacer`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
  for (const el of work.children) {
    el.classList.remove(`${CLASS_PREFIX}__hidden`);
    el.removeAttribute("aria-hidden");
  }
}

function createCollapseToggle(
  work: HTMLElement,
  elementsToToggle: Element[],
  isCollapsed: boolean = true
): HTMLButtonElement {
  const toggle = el("button", {
    type: "button",
    className: `${CLASS_PREFIX}__collapsed__toggle`,
    textContent: isCollapsed ? "Show details" : "Hide details",
    attrs: {
      "aria-expanded": String(!isCollapsed),
      "aria-controls": work.id,
    },
  });

  toggle.addEventListener("click", (ev) => {
    ev.preventDefault();
    const isExpanding = work.classList.contains(`${CLASS_PREFIX}__collapsed`);

    for (const el of elementsToToggle) {
      el.classList.toggle(`${CLASS_PREFIX}__hidden`, !isExpanding);
      el.toggleAttribute("aria-hidden", !isExpanding);
    }

    toggle.textContent = isExpanding ? "Hide details" : "Show details";
    toggle.setAttribute("aria-expanded", String(isExpanding));
    work.classList.toggle(`${CLASS_PREFIX}__collapsed`, !isExpanding);
  });

  return toggle;
}

function createClearSpacer(): HTMLElement {
  return el("div", {
    className: `${CLASS_PREFIX}__collapsed__spacer`,
    style: { clear: "both" },
  });
}

function getStyles(prefix: string): string {
  return `
    .${prefix}__collapsed__toggle {
      float: right;
    }
    .${prefix}__collapsed .${prefix}__text-indicator {
      float: left;
      margin-top: 0em;
      text-align: left;
    }
    .${prefix}__collapsed .${prefix}__toggle {
      float: right;
      margin: 4px 0px;
      position: relative;
      bottom: auto;
      left: auto;
    }
  `;
}
