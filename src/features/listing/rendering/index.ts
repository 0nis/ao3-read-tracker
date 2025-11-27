import { CLASS_PREFIX } from "@constants";
import { ReadWork, IgnoredWork, SettingsData } from "@types";
import { extractWorkIdFromListingId } from "@utils/ao3";
import { ensureChild } from "@utils/ui";
import { getManifest } from "@utils/extension";
import { settingsCache } from "@services/cache";
import { collectDisplayRules } from "@services/rules";

import { addText, removeText } from "./marks/text";
import { addSymbols, removeSymbols } from "./marks/symbols";
import { addClasses, removeClasses } from "./marks/classes";

import { unCollapse } from "./display/collapse";
import { unhide } from "./display/hide";

import { getWorkStatusData, mapDisplayModeToFn } from "../handlers";

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
    await applyMarksToWork({
      item,
      readWork: readWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
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

    removeClasses(item);
    removeText(item);
    removeSymbols(item);
    unCollapse(item);
    unhide(item.id);

    await applyMarksToWork({
      item,
      readWork: readWorks[id],
      ignoredWork: ignoredWorks[id],
      settings,
    });
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

export interface ApplyMarksParams {
  item: HTMLElement;
  readWork: ReadWork | undefined;
  ignoredWork: IgnoredWork | undefined;
  settings: SettingsData;
}

async function applyMarksToWork(params: ApplyMarksParams) {
  createOrModifyLandmarkHeading(params.item);
  addClasses(params);
  addText(params);
  if (!params.settings.generalSettings.hideSymbols) await addSymbols(params);
  adjustWorkDisplay(params);
}

function adjustWorkDisplay({
  item,
  readWork,
  ignoredWork,
  settings,
}: ApplyMarksParams) {
  const rules = collectDisplayRules(settings, readWork, ignoredWork);

  // TODO: Create setting deciding what order these go in (which take priority)
  const rule = rules.find((r) => r.shouldApply());
  if (!rule) return;

  const displayFn = mapDisplayModeToFn(rule.getMode());
  displayFn(item);
}

const extensionName = getManifest().data?.name || "Read Tracker";
function createOrModifyLandmarkHeading(item: HTMLElement) {
  ensureChild(item, `${CLASS_PREFIX}__text-indicator__landmark`, "h6", {
    className: "landmark heading",
    textContent: `${extensionName} Extension Information`,
  });
}
