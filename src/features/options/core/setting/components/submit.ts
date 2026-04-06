import { SettingsSectionConfig } from "../types";
import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el } from "../../../../../utils/ui/dom";

export function createSettingsSectionSaveButton(
  title: SettingsSectionConfig<any>["title"],
): HTMLButtonElement {
  return el(
    "button",
    {
      className: `button ${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--save`,
      attrs: { "aria-label": `Save ${title}`, type: "submit" },
    },
    ["Save"],
  );
}
