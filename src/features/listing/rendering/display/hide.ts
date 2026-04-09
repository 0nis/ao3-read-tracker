import { CLASS_PREFIX } from "../../../../constants/classes";
import { getWorkElement } from "../../helpers";

/**
 * Completely hides a work from the listing.
 * Warning: This won't update the amount of works shown on the page! May result in empty pages.
 */
export async function hide(workOrId: HTMLElement | string): Promise<void> {
  const work = getWorkElement(workOrId);
  if (!work) return;
  if (!work.classList.contains(`${CLASS_PREFIX}__hidden`)) {
    work.classList.add(
      `${CLASS_PREFIX}__hidden`,
      `${CLASS_PREFIX}__hidden--work-listing`,
    );
    work.setAttribute("aria-hidden", "true");
  }
}

/** Unhides a work in the listing, making it visible again. */
export async function unhide(workOrId: HTMLElement | string): Promise<void> {
  const work = getWorkElement(workOrId);
  if (!work) return;
  if (work.classList.contains(`${CLASS_PREFIX}__hidden`)) {
    work.classList.remove(
      `${CLASS_PREFIX}__hidden`,
      `${CLASS_PREFIX}__hidden--work-listing`,
    );
    work.removeAttribute("aria-hidden");
  }
}
