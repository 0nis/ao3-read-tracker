import { CLASS_PREFIX } from "../../../constants/classes";

/**
 * Hides the details of a work in the listing to take up less space.
 * @param workOrId The work element or its ID
 * @param mode "gentle" or "aggressive": gentle leaves the header visible, aggressive hides everything except the indicator and toggle
 */
export function collapse(
  workOrId: HTMLElement | string,
  mode: "gentle" | "aggressive"
) {
  const work =
    typeof workOrId === "string"
      ? document.getElementById(`work_${workOrId}`)
      : workOrId;
  if (!work) return;
  if (work.classList.contains(`${CLASS_PREFIX}__collapsed`)) return; // Already collapsed

  addStyles();

  const textIndicator = work.querySelector<HTMLElement>(
    `.${CLASS_PREFIX}__text-indicator`
  );
  const symbolIndicator = work.querySelector<HTMLElement>(
    `.${CLASS_PREFIX}__symbol-indicator`
  );

  const header = work.querySelector<HTMLElement>(".header.module");

  const elementsToHide = Array.from(work.children).filter(
    (child) =>
      ![textIndicator, symbolIndicator, header]
        .filter(Boolean)
        .includes(child as HTMLElement)
  );

  work.classList.add(`${CLASS_PREFIX}__collapsed`);
  for (const el of elementsToHide) el.classList.add(`${CLASS_PREFIX}__hidden`);
  if (mode === "aggressive" && header) {
    header.classList.add(`${CLASS_PREFIX}__hidden`);
    if (symbolIndicator && header.contains(symbolIndicator)) {
      work.insertBefore(symbolIndicator, header);
    }
  }

  const toggle = createCollapseToggle(
    work,
    elementsToHide,
    header,
    symbolIndicator
  );
  work.appendChild(toggle);
}

function createCollapseToggle(
  work: HTMLElement,
  elementsToToggle: Element[],
  header?: HTMLElement | null,
  symbolIndicator?: HTMLElement | null
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

    if (symbolIndicator && header) {
      if (!isCollapsed) work.insertBefore(symbolIndicator, header);
      else header.appendChild(symbolIndicator);
    }
  });

  return toggle;
}

// TODO: Fix symbol indicator position when collapsed
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
    .${CLASS_PREFIX}__collapsed .${CLASS_PREFIX}__symbol-indicator {
      position: relative !important;
      top: auto;
      float: none;
    }
  `;
  document.head.appendChild(style);
}
