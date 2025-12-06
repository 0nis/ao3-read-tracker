import { removeText } from "./marks/text";
import { removeSymbols } from "./marks/symbols";
import { removeClasses } from "./marks/classes";
import { unCollapse } from "./display/collapse";
import { unhide } from "./display/hide";

import { applyMarksToWork } from "./apply";
import { getWorkStatusData } from "../handlers";

import { settingsCache } from "../../../services/cache";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { addStatusElement, createHiddenWorksCountEl } from "./status";

/**
 * Applies work states visually to all relevant works on the current listing page.
 *
 * Adjusts:
 * - classes
 * - text (state indicators and notes)
 * - symbols in the work header
 * - display (collapsing/hiding)
 */
export async function markWorksOnPage(): Promise<void> {
  const data = await getWorkStatusData();
  if (!data) return;

  const { elements, finishedWorks, inProgressWorks, ignoredWorks } = data;
  const settings = await settingsCache.get();

  for (const el of elements) {
    const id = extractWorkIdFromListingId(el.id);
    if (!id) continue;
    await applyMarksToWork({
      element: el,
      finishedWork: finishedWorks[id],
      inProgressWork: inProgressWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
  }

  addStatusElement(createHiddenWorksCountEl(elements));
}

/**
 * Updates works on the current listing page to reflect any changes
 * in their states. Used when the BFCache is restored.
 */
export async function updateWorksOnPage(): Promise<void> {
  const data = await getWorkStatusData();
  if (!data) return;

  const { elements, finishedWorks, inProgressWorks, ignoredWorks } = data;
  const settings = await settingsCache.get();

  for (const el of elements) {
    const id = extractWorkIdFromListingId(el.id);
    if (!id) continue;

    removeClasses(el);
    removeText(el);
    removeSymbols(el);
    unCollapse(el);
    unhide(el.id);

    await applyMarksToWork({
      element: el,
      finishedWork: finishedWorks[id],
      inProgressWork: inProgressWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
  }
}
