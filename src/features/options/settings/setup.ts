import { SectionElements } from "../renderer";
import { SectionId, SectionType } from "../config";
import { loadAllSettingsSections } from "./helpers/load";
import { setupSettingsSaveHandlers } from "./helpers/save";

export async function setupSettings(sections: SectionElements): Promise<void> {
  const settingsSections = Object.keys(sections)
    .filter((key) => sections[key as SectionId].type === SectionType.SETTINGS)
    .reduce((obj, key) => {
      obj[key as SectionId] = sections[key as SectionId];
      return obj;
    }, {} as SectionElements);

  await loadAllSettingsSections(settingsSections);
  setupSettingsSaveHandlers(settingsSections);
}
