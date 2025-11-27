import { settingsCache } from "@services/cache";
import { populateSection } from "@utils/ui";

import { SectionId, SectionElements } from "../../config";
import { SETTINGS_LOAD_MAP } from "../config";

export async function loadAllSettingsSections(sections: SectionElements) {
  const all = await settingsCache.get();

  for (const id of Object.keys(sections) as SectionId[]) {
    const section = sections[id];
    const getData = SETTINGS_LOAD_MAP[id];
    if (!getData) continue;

    const data = getData(all);
    if (data) {
      populateSection(section.element, data);
    }
  }
}
