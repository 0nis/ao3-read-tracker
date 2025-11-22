import { CLASS_PREFIX } from "../../../constants/classes";
import { getWorkById } from "../../../utils/ao3";

/**
 * Completely hides a work from the listing.
 * Warning: This won't update the amount of works shown on the page! May result in empty pages.
 * @param id ID of the work to hide
 */
export async function hide(id: string): Promise<void> {
  const work = getWorkById(id);
  if (!work) return;
  if (!work.classList.contains(`${CLASS_PREFIX}__hidden`))
    work.classList.add(`${CLASS_PREFIX}__hidden`);
}

/**
 * Unhides a work in the listing, making it visible again.
 * @param id ID of the work to unhide
 */
export async function unhide(id: string): Promise<void> {
  const work = getWorkById(id);
  if (!work) return;
  if (work.classList.contains(`${CLASS_PREFIX}__hidden`)) {
    work.classList.remove(`${CLASS_PREFIX}__hidden`);
  }
}
