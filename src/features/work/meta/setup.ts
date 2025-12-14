import { getStyles } from "./style";
import { addDetailsToWorkMetaArea } from "./instances/details";
import { createNotesInNewWorkMetaArea } from "./instances/notes";

import { StorageService } from "../../../services/storage";
import { getIdFromUrl } from "../../../utils/ao3";
import { warn } from "../../../utils/extension";
import { handleStorageRead } from "../../../utils/storage";
import { injectStyles } from "../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkStateData } from "../../../types/works";

export const getClass = () => `${CLASS_PREFIX}__work-meta`;

// TODO:
// - Maybe combine the details? It looks ugly now... Then go back to finished yes/no, etc
// - Don't add a separate area for the notes? Was not how I imagined it to be

export async function setupWorkMetaAreas(): Promise<void> {
  const id = getIdFromUrl();
  if (!id) {
    warn("Could not extract work ID from URL. Skipping meta setup.");
    return;
  }

  injectStyles(`${CLASS_PREFIX}__styles--work-meta`, getStyles(getClass()));

  const data = await getWorkStateData(id);

  addDetailsToWorkMetaArea(data);
  createNotesInNewWorkMetaArea(data);
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
