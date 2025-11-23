import { addText, removeText } from "./text";
import { unCollapse } from "./collapse";
import { addSymbols, removeSymbols } from "./symbols";

import {
  collectDisplayRules,
  getFicStatusData,
  mapDisplayModeToFn,
} from "../handlers";
import { extractWorkIdFromListingId } from "../../../utils/ao3";
import { ensureChild } from "../../../utils/ui/dom";

import {
  READ_CLASS,
  IGNORED_CLASS,
  REREAD_WORTHY_CLASS,
  CLASS_PREFIX,
  STILL_READING_CLASS,
} from "../../../constants/classes";
import { WorkState } from "../../../constants/enums";
import {
  type ReadFic,
  type IgnoredFic,
  SettingsData,
} from "../../../types/storage";
import { hide, unhide } from "./hide";
import { getManifest } from "../../../utils/extension/manifest";
import { handleGetAllSettings } from "../../../utils/storage/settings";

/**
 * Marks fics on the current listing page as read/ignored based on stored data, with their appropriate indicators.
 */
export async function markFicsOnPage(): Promise<void> {
  const { readFics, ignoredFics, items, settings } =
    (await getDataAndItems()) || {};
  if (!readFics || !ignoredFics || !items || !settings) return;

  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (!id) continue;
    await applyMarksToWork(item, readFics[id], ignoredFics[id], settings);
  }
}

/**
 * Updates fics on the current listing page to reflect any changes in their read/ignored status, adjusting indicators as needed.
 */
export async function updateFicsOnPage(): Promise<void> {
  const { readFics, ignoredFics, items, settings } =
    (await getDataAndItems()) || {};
  if (!readFics || !ignoredFics || !items || !settings) return;

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
    await applyMarksToWork(item, readFics[id], ignoredFics[id], settings);
  }
}

async function getDataAndItems(): Promise<
  | {
      readFics: Record<string, ReadFic>;
      ignoredFics: Record<string, IgnoredFic>;
      items: HTMLElement[];
      settings: SettingsData;
    }
  | undefined
> {
  const { worksList, data } = await getFicStatusData();
  if (!worksList || !data) return;

  const settings = await handleGetAllSettings();

  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );
  const { readFics, ignoredFics } = data;
  return { readFics, ignoredFics, items, settings };
}

async function applyMarksToWork(
  item: HTMLElement,
  readFic: ReadFic | undefined,
  ignoredFic: IgnoredFic | undefined,
  settings: SettingsData
) {
  createOrModifyLandmarkHeading(item);
  if (readFic) markAsRead(item, readFic, settings);
  if (ignoredFic) markAsIgnored(item, ignoredFic, settings);
  adjustWorkDisplay(item, settings, readFic, ignoredFic);
}

function markAsRead(work: HTMLElement, item: ReadFic, settings: SettingsData) {
  work.classList.add(READ_CLASS);
  if (item.rereadWorthy) work.classList.add(REREAD_WORTHY_CLASS);
  if (item.isReading) work.classList.add(STILL_READING_CLASS);
  addText(work, WorkState.READ, item);
  if (!settings.generalSettings.hideSymbols)
    addSymbols(work, WorkState.READ, item);
}

function markAsIgnored(
  work: HTMLElement,
  item: IgnoredFic,
  settings: SettingsData
) {
  work.classList.add(IGNORED_CLASS);
  addText(work, WorkState.IGNORED, item);
  if (!settings.generalSettings.hideSymbols)
    addSymbols(work, WorkState.IGNORED, item);
}

function adjustWorkDisplay(
  work: HTMLElement,
  settings: SettingsData,
  readFic?: ReadFic,
  ignoredFic?: IgnoredFic
) {
  const rules = collectDisplayRules(settings, readFic, ignoredFic);

  // TODO: Create setting deciding what order these go in (which take priority)
  const rule = rules.find((r) => r.shouldApply());
  if (!rule) return;

  const displayFn = mapDisplayModeToFn(rule.getMode());
  displayFn(work);
}

function createOrModifyLandmarkHeading(work: HTMLElement) {
  ensureChild(work, `${CLASS_PREFIX}__text-indicator__landmark`, "h6", {
    className: "landmark heading",
    textContent: `${
      getManifest().data?.name || "Mark as Read"
    } Extension Information`,
  });
}
