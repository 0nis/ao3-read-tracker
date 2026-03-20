import { DisplayMode } from "../../../../../../enums/settings";
import { settingsCache } from "../../../../../../services/cache";
import { el } from "../../../../../../utils/ui/dom";
import { createSectionWrapper } from "../../../../components/section/component";
import { SectionId } from "../../../../config";

export async function buildDisplayModePrioritesPart(): Promise<HTMLElement> {
  const section = createSectionWrapper({
    id: SectionId.DISPLAY_MODES,
    title: "Display Mode Priorities",
  });

  const { displayModeSettings } = await settingsCache.get();

  // TODO: Transform into a setting and update in database
  for (const [displayMode, priority] of Object.entries(
    displayModeSettings.priorities,
  ) as [DisplayMode, number][]) {
    const option = el(
      "option",
      { value: displayMode },
      `${displayMode}: ${priority}`,
    );
    section.appendChild(option);
  }

  return section;
}
