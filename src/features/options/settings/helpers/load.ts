import { SETTINGS_LOAD_MAP } from "../config";
import { SectionId } from "../../config";
import { SectionElements } from "../../renderer";

import { settingsCache } from "../../../../services/cache/settings";
import { populateForm } from "../../../../utils/ui/forms";

export async function loadAllSettingsSections(sections: SectionElements) {
  const all = await settingsCache.get();

  for (const id of Object.keys(sections) as SectionId[]) {
    const section = sections[id];
    const getData = SETTINGS_LOAD_MAP[id];
    if (!getData) continue;

    const data = getData(all);
    if (data) {
      populateForm(section.element, data);
    }
  }
}
