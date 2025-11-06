import {
  COLLAPSED_CLASS,
  IGNORED_CLASS,
  INDICATOR_CLASS,
  READ_CLASS,
  TOGGLE_CLASS,
} from "../../constants/classes";
import { getTrackedFics } from "../../services/tracking";
import { IgnoredFicInfo, ReadFicInfo } from "../../types/storage";
import {
  extractWorkIdFromListingId,
  getWorksListFromListing,
} from "../../utils/ao3";

export async function markFicsOnPage(): Promise<void> {
  const worksList = getWorksListFromListing();
  if (!worksList) return;

  const tracked = await getTrackedFics();
  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;

    item.classList.remove(READ_CLASS, IGNORED_CLASS);

    if (tracked.read[id]) markAsRead(item, tracked.read[id]);
    if (tracked.ignored[id]) markAsIgnored(item, tracked.ignored[id]);
  }
}

function markAsRead(work: HTMLElement, item: ReadFicInfo) {
  work.classList.add(READ_CLASS);
  // TODO: Allow modification of behavior through settings
  addTextIndicator(work, "read", item);
  collapse(work, "gentle");
}

function markAsIgnored(work: HTMLElement, item: IgnoredFicInfo) {
  work.classList.add(IGNORED_CLASS);
  // TODO: Allow modification of behavior through settings
  addTextIndicator(work, "ignored", item);
  collapse(work, "aggressive");
}

/**
 * Adds a text indicator to a work element showing that it was marked as read/ignored.
 * @param work The work element
 * @param type The type of indicator ("read" or "ignored")
 * @param item The item data containing timestamp and optional reason
 */
function addTextIndicator(
  work: HTMLElement,
  type: "read" | "ignored",
  item: ReadFicInfo | IgnoredFicInfo
) {
  const indicator = document.createElement("p");
  indicator.classList.add(INDICATOR_CLASS, `${INDICATOR_CLASS}__${type}`);
  const date = new Date(item.timestamp);
  indicator.textContent = `Marked as ${type} on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  if (type === "ignored" && "reason" in item && item.reason)
    indicator.textContent += ` (Reason: ${item.reason})`;
  work.appendChild(indicator);
}

/**
 * Hides the details of a work in the listing to take up less space.
 * @param workOrId The work element or its ID
 * @param mode "gentle" or "aggressive": gentle leaves the header visible, aggressive hides everything except the indicator and toggle
 */
export function collapse(
  workOrId: HTMLElement | string,
  mode: "gentle" | "aggressive"
): void {
  const work =
    typeof workOrId === "string"
      ? document.getElementById(`work_${workOrId}`)
      : workOrId;
  if (!work) return;

  const header = work.querySelector<HTMLElement>(".header.module");
  const indicator = work.querySelector<HTMLElement>(`.${INDICATOR_CLASS}`);
  if (!indicator) return;

  const elementsToHide = Array.from(work.children).filter((child) => {
    if (child === indicator) return false;
    if (mode === "gentle" && child === header) return false;
    return true;
  });

  work.classList.add(COLLAPSED_CLASS);

  for (const el of elementsToHide) el.classList.add("hidden");
  if (mode === "aggressive" && header) header.classList.add("hidden");

  const toggle = createCollapseToggle(work, elementsToHide);
  work.appendChild(toggle);
}

/**
 * Creates a toggle button for collapsing/expanding a work element.
 * @param work The work element to collapse/expand
 * @param elementsToToggle The elements to show/hide when toggled
 * @returns The created toggle button element
 */
function createCollapseToggle(
  work: HTMLElement,
  elementsToToggle: Element[]
): HTMLButtonElement {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = TOGGLE_CLASS;
  toggle.textContent = "Show details";

  toggle.addEventListener("click", (ev) => {
    ev.preventDefault();
    const isCollapsed = toggle.textContent === "Show details";

    for (const el of elementsToToggle)
      el.classList.toggle("hidden", !isCollapsed);

    toggle.textContent = isCollapsed ? "Hide details" : "Show details";
    work.classList.toggle(COLLAPSED_CLASS, !isCollapsed);
  });

  return toggle;
}

/**
 * Completely hides a work from the listing.
 * Warning: This won't update the amount of works shown on the page! May result in empty pages.
 * @param id ID of the work to hide
 */
export async function hide(id: string): Promise<void> {
  const work = document.getElementById(`work_${id}`);
  if (work) work.classList.add("hidden");
}
