import { getStyles } from "./style";
import { addDetails, addStates, addNotes } from "./instances";
import { removeExtensionMetaFromArea } from "./helpers";

import { StorageService } from "../../../services/storage/storage";
import { settingsCache } from "../../../services/cache";
import { getIdFromUrl } from "../../../shared/ao3";
import { warn } from "../../../shared/extension/logger";
import { handleStorageRead } from "../../../shared/storage/handlers";
import { injectStyles } from "../../../utils/dom";

import { CLASS_PREFIX } from "../../../constants/classes";
import { ABBREVIATION } from "../../../constants/global";
import { WorkStateData } from "../../../types/works";
import { ModuleStates } from "../../../types/settings";

export const getClass = () => `${CLASS_PREFIX}__work-meta`;

export type WorkContext = {
  states: WorkStateData;
  modules?: ModuleStates;
};

export async function setupWorkMetaAreas(): Promise<void> {
  const id = getIdFromUrl();
  if (!id) {
    warn("Could not extract work ID from URL. Skipping meta setup.");
    return;
  }

  const workMetaArea =
    document.querySelector<HTMLElement>("dl.work.meta.group");
  if (!workMetaArea) {
    warn("Default AO3 work meta area not found. Skipping meta setup.");
    return;
  }

  injectStyles(`${CLASS_PREFIX}__styles--work-meta`, getStyles(getClass()));

  document.addEventListener(`${ABBREVIATION}:updated`, async () => {
    removeExtensionMetaFromArea(workMetaArea);
    await addExtensionMetaToArea(id, workMetaArea);
  });

  await addExtensionMetaToArea(id, workMetaArea);
}

async function addExtensionMetaToArea(
  id: string,
  workMetaArea: HTMLElement,
): Promise<void> {
  const context = {
    states: await getWorkStateData(id),
    modules: (await settingsCache.get()).generalSettings.modules,
  };

  addStates(context, workMetaArea);
  addDetails(context, workMetaArea);
  addNotes(context, workMetaArea);
}

async function getWorkStateData(id: string): Promise<WorkStateData> {
  const {
    finishedWorks = {},
    inProgressWorks = {},
    ignoredWorks = {},
  } = (await handleStorageRead(StorageService.getByIds([id]), {
    errorMsg: "Failed to retrieve stored work data.",
    errorOnUndefined: true,
  })) || {};

  return {
    finishedWork: finishedWorks[id],
    inProgressWork: inProgressWorks[id],
    ignoredWork: ignoredWorks[id],
  };
}
