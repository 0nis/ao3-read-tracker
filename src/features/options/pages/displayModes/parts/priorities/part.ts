import { CLASS_PREFIX } from "../../../../../../constants/classes";
import { settingsCache } from "../../../../../../services/cache";
import { injectStyles } from "../../../../../../utils/ui/dom";
import { createSectionWrapper } from "../../../../core/components/section/component";
import { SectionId } from "../../../../config";
import { createDisplayModePrioritiesController } from "./controller";
import { getStyles } from "./style";

export const getClass = () => `${CLASS_PREFIX}__dm-priorities`;

export async function buildDisplayModePrioritesPart(): Promise<HTMLElement> {
  injectStyles(`${CLASS_PREFIX}__styles--dm-priorities`, getStyles(getClass()));

  const section = createSectionWrapper({
    id: SectionId.DISPLAY_MODES,
    title: "Display Mode Priorities",
  });

  const { displayModeSettings } = await settingsCache.get();
  console.log(displayModeSettings); // todo: temp, remove

  const controller = await createDisplayModePrioritiesController(
    displayModeSettings.priorities,
  );
  section.appendChild(controller.el);

  return section;
}
