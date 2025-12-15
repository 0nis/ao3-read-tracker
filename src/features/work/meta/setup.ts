import { getStyles } from "./style";
import { addDetails, addStates, addNotes } from "./instances";

import { StorageService } from "../../../services/storage";
import { getIdFromUrl } from "../../../utils/ao3";
import { warn } from "../../../utils/extension";
import { handleStorageRead } from "../../../utils/storage";
import { injectStyles } from "../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkStateData } from "../../../types/works";

export const getClass = () => `${CLASS_PREFIX}__work-meta`;

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

  const data = await getWorkStateData(id);

  addStates(data, workMetaArea);
  addDetails(data, workMetaArea);
  addNotes(data, workMetaArea);
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
