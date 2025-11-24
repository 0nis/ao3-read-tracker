import { addText, removeText } from "./text";
import { addSymbols, removeSymbols } from "./symbols";
import { unCollapse } from "./collapse";
import { unhide } from "./hide";

import { settingsCache } from "../../../services/cache/settings";
import {
  collectDisplayRules,
  getWorkStatusData,
  mapDisplayModeToFn,
} from "../handlers";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { ensureChild } from "../../../utils/ui/dom";
import { getManifest } from "../../../utils/extension/manifest";

import {
  READ_CLASS,
  IGNORED_CLASS,
  REREAD_WORTHY_CLASS,
  CLASS_PREFIX,
  STILL_READING_CLASS,
} from "../../../constants/classes";

import { WorkState } from "../../../enums/works";

import { SettingsData } from "../../../types/settings";
import { ReadWork, IgnoredWork } from "../../../types/works";

/**
 * Marks works on the current listing page as read/ignored based on stored data, with their appropriate indicators.
 */
export async function markWorksOnPage(): Promise<void> {
  const { readWorks, ignoredWorks, items, settings } =
    (await getDataAndItems()) || {};
  if (!readWorks || !ignoredWorks || !items || !settings) return;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;
    await applyMarksToWork(item, readWorks[id], ignoredWorks[id], settings);
  }
}

/**
 * Updates works on the current listing page to reflect any changes in their read/ignored status, adjusting indicators as needed.
 */
export async function updateWorksOnPage(): Promise<void> {
  const { readWorks, ignoredWorks, items, settings } =
    (await getDataAndItems()) || {};
  if (!readWorks || !ignoredWorks || !items || !settings) return;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;

    item.classList.remove(
      READ_CLASS,
      IGNORED_CLASS,
      REREAD_WORTHY_CLASS,
      STILL_READING_CLASS
    );

    removeText(item);
    removeSymbols(item);
    unCollapse(item);
    unhide(item.id);
    await applyMarksToWork(item, readWorks[id], ignoredWorks[id], settings);
  }
}

async function getDataAndItems(): Promise<
  | {
      readWorks: Record<string, ReadWork>;
      ignoredWorks: Record<string, IgnoredWork>;
      items: NodeListOf<HTMLElement>;
      settings: SettingsData;
    }
  | undefined
> {
  const { worksList, data } = await getWorkStatusData();
  if (!worksList || !data) return;
  const { readWorks, ignoredWorks } = data;

  const settings = await settingsCache.get();
  const items = worksList.querySelectorAll<HTMLLIElement>("li.work");

  return { readWorks, ignoredWorks, items, settings };
}

async function applyMarksToWork(
  item: HTMLElement,
  readWork: ReadWork | undefined,
  ignoredWork: IgnoredWork | undefined,
  settings: SettingsData
) {
  createOrModifyLandmarkHeading(item);
  if (readWork) await markAsRead(item, readWork, settings);
  if (ignoredWork) await markAsIgnored(item, ignoredWork, settings);
  adjustWorkDisplay(item, settings, readWork, ignoredWork);
}

async function markAsRead(
  work: HTMLElement,
  item: ReadWork,
  settings: SettingsData
) {
  work.classList.add(READ_CLASS);
  if (item.rereadWorthy) work.classList.add(REREAD_WORTHY_CLASS);
  if (item.isReading) work.classList.add(STILL_READING_CLASS);
  addText(work, WorkState.READ, item);
  if (!settings.generalSettings.hideSymbols)
    await addSymbols(work, WorkState.READ, item);
}

async function markAsIgnored(
  work: HTMLElement,
  item: IgnoredWork,
  settings: SettingsData
) {
  work.classList.add(IGNORED_CLASS);
  addText(work, WorkState.IGNORED, item);
  if (!settings.generalSettings.hideSymbols)
    await addSymbols(work, WorkState.IGNORED, item);
}

function adjustWorkDisplay(
  work: HTMLElement,
  settings: SettingsData,
  readWork?: ReadWork,
  ignoredWork?: IgnoredWork
) {
  const rules = collectDisplayRules(settings, readWork, ignoredWork);

  // TODO: Create setting deciding what order these go in (which take priority)
  const rule = rules.find((r) => r.shouldApply());
  if (!rule) return;

  const displayFn = mapDisplayModeToFn(rule.getMode());
  displayFn(work);
}

const extensionName = getManifest().data?.name || "Read Tracker";
function createOrModifyLandmarkHeading(work: HTMLElement) {
  ensureChild(work, `${CLASS_PREFIX}__text-indicator__landmark`, "h6", {
    className: "landmark heading",
    textContent: `${extensionName} Extension Information`,
  });
}
