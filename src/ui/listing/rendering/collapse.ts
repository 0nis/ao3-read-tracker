import { CLASS_PREFIX } from "../../../constants/classes";
import { CollapseMode } from "../../../constants/enums";
import { el, getElement, injectStyles } from "../../../utils/dom";

/**
 * Hides the details of a work in the listing to take up less space.
 * @param workOrId The work element or its ID
 * @param mode "gentle" or "aggressive": gentle leaves the header visible, aggressive hides everything except the indicator and toggle
 */
export function collapse(workOrId: HTMLElement | string, mode: CollapseMode) {
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
  for (const el of elementsToHide) el.classList.add(`${CLASS_PREFIX}__hidden`);

  const toggle = createCollapseToggle(work, elementsToHide, isCollapsed);
  work.appendChild(toggle);
}

/**
 * Un-collapses a work in the listing to show all its details.
 * @param workOrId The work element or its ID
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
  for (const el of work.children)
    el.classList.remove(`${CLASS_PREFIX}__hidden`);
}

function getWork(workOrId: HTMLElement | string): HTMLElement | null {
  if (typeof workOrId === "string")
    return document.getElementById(`work_${workOrId}`);
  return workOrId;
}

function createCollapseToggle(
  work: HTMLElement,
  elementsToToggle: Element[],
  isCollapsed: boolean = true
): HTMLButtonElement {
  const toggle = el("button", {
    type: "button",
    className: `${CLASS_PREFIX}__collapsed__toggle`,
    textContent: isCollapsed ? "Hide details" : "Show details",
  });

  toggle.addEventListener("click", (ev) => {
    ev.preventDefault();
    const isCollapsed = toggle.textContent === "Show details";

    for (const el of elementsToToggle)
      el.classList.toggle(`${CLASS_PREFIX}__hidden`, !isCollapsed);

    toggle.textContent = isCollapsed ? "Hide details" : "Show details";
    work.classList.toggle(`${CLASS_PREFIX}__collapsed`, !isCollapsed);
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
