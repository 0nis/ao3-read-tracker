import { CLASS_PREFIX } from "../../../constants/classes";
import { getWorkById } from "../../../utils/ao3";
import { getWork } from "../handlers";

/**
 * Completely hides a work from the listing.
 * Warning: This won't update the amount of works shown on the page! May result in empty pages.
 * @param workOrId The work element or its ID
 */
export async function hide(workOrId: HTMLElement | string): Promise<void> {
  const work = getWork(workOrId);
  if (!work) return;
  if (!work.classList.contains(`${CLASS_PREFIX}__hidden`))
    work.classList.add(`${CLASS_PREFIX}__hidden`);
}

/**
 * Unhides a work in the listing, making it visible again.
 * @param workOrId The work element or its ID
 */
export async function unhide(workOrId: HTMLElement | string): Promise<void> {
  const work = getWork(workOrId);
  if (!work) return;
  if (work.classList.contains(`${CLASS_PREFIX}__hidden`)) {
    work.classList.remove(`${CLASS_PREFIX}__hidden`);
  }
}
