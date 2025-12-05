import { SettingsSectionConfig } from "../types";
import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";

export function createSettingsSectionSaveButton(
  title: SettingsSectionConfig<any>["title"]
): HTMLButtonElement {
  return el(
    "button",
    {
      className: `button ${PREFIX}__button ${PREFIX}__button--save`,
      attrs: { "aria-label": `Save ${title}`, type: "submit" },
    },
    ["Save"]
  );
}
