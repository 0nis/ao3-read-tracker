import { addText, removeText } from "./marks/text";
import { addSymbols, removeSymbols } from "./marks/symbols";
import { addClasses, removeClasses } from "./marks/classes";

import { unCollapse } from "./display/collapse";
import { unhide } from "./display/hide";

import { getWorkStatusData, mapDisplayModeToFn } from "../handlers";

import { settingsCache } from "../../../services/cache/settings";
import { collectDisplayRules } from "../../../services/rules/display";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { ensureChild } from "../../../utils/ui/dom";
import { getManifest } from "../../../utils/extension/manifest";
import { CLASS_PREFIX } from "../../../constants/classes";
import { SettingsData } from "../../../types/settings";
import { ReadWork, IgnoredWork } from "../../../types/works";

/**
 * Marks works on the current listing page as read/ignored based on
 * stored data, with their appropriate indicators.
 */
export async function markWorksOnPage(): Promise<void> {
  const data = await getWorkStatusData();
  if (!data) return;

  const { elements, readWorks, ignoredWorks } = data;
  const settings = await settingsCache.get();

  for (const el of elements) {
    const id = extractWorkIdFromListingId(el.id);
    if (!id) continue;
    await applyMarksToWork({
      element: el,
      readWork: readWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
  }
}

/**
 * Updates works on the current listing page to reflect any changes
 * in their read/ignored status, adjusting indicators as needed.
 */
export async function updateWorksOnPage(): Promise<void> {
  const data = await getWorkStatusData();
  if (!data) return;

  const { elements, readWorks, ignoredWorks } = data;
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
      readWork: readWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
  }
}

export interface ApplyMarksParams {
  element: HTMLElement;
  readWork: ReadWork | undefined;
  ignoredWork: IgnoredWork | undefined;
  settings: SettingsData;
}

async function applyMarksToWork(params: ApplyMarksParams) {
  ensureLandmarkHeadingPresent(params.element);
  addClasses(params);
  addText(params);
  if (!params.settings.generalSettings.hideSymbols) await addSymbols(params);
  adjustWorkDisplay(params);
}

function adjustWorkDisplay({
  element,
  readWork,
  ignoredWork,
  settings,
}: ApplyMarksParams) {
  const rules = collectDisplayRules(settings, readWork, ignoredWork);

  // TODO: Create setting deciding what order these go in (which take priority)
  const rule = rules.find((r) => r.shouldApply());
  if (!rule) return;

  const displayFn = mapDisplayModeToFn(rule.getMode());
  displayFn(element);
}

function ensureLandmarkHeadingPresent(element: HTMLElement) {
  ensureChild({
    parent: element,
    className: `${CLASS_PREFIX}__text-indicator__landmark`,
    tag: "h6",
    createProps: {
      className: "landmark heading",
      textContent: `${
        getManifest().data?.name || "Read Tracker"
      } Extension Information`,
    },
  });
}

function countHiddenWorks(elements: NodeListOf<HTMLElement>): number {
  return Array.from(elements).filter((element) =>
    element.classList.contains(`${CLASS_PREFIX}__hidden`)
  ).length;
}
