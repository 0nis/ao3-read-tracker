import { CLASS_PREFIX } from "../../../constants/classes";
import { CollapseMode } from "../../../constants/enums";
import { getElement } from "../../../utils/dom";

/**
 * Hides the details of a work in the listing to take up less space.
 * @param workOrId The work element or its ID
 * @param mode "gentle" or "aggressive": gentle leaves the header visible, aggressive hides everything except the indicator and toggle
 */
export function collapse(workOrId: HTMLElement | string, mode: CollapseMode) {
  const work = getWork(workOrId);
  if (!work) return;
  if (work.classList.contains(`${CLASS_PREFIX}__collapsed`)) return; // Already collapsed

  work.appendChild(createClearSpacer());
  addStyles();

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
  if (mode === CollapseMode.AGGRESSIVE && header)
    header.classList.add(`${CLASS_PREFIX}__hidden`);

  const toggle = createCollapseToggle(work, elementsToHide);
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
  elementsToToggle: Element[]
): HTMLButtonElement {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = `${CLASS_PREFIX}__collapsed__toggle`;
  toggle.textContent = "Show details";

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
  const spacer = document.createElement("div");
  spacer.style.clear = "both";
  return spacer;
}

export function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__collapsed__toggle {
      float: right;
    }
    .${CLASS_PREFIX}__collapsed .${CLASS_PREFIX}__text-indicator {
      float: left;
      margin-top: 0em;
      text-align: left;
    }
    .${CLASS_PREFIX}__collapsed .${CLASS_PREFIX}__toggle {
      float: right;
      margin: 4px 0px;
      position: relative;
      bottom: auto;
      left: auto;
    }
  `;
  document.head.appendChild(style);
}
