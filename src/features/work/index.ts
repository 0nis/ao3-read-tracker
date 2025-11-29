import { setupWorkButtons } from "./buttons/setup";
import { getFormStyles } from "./forms/style";

import { CLASS_PREFIX } from "../../constants/classes";
import { injectStyles } from "../../utils/ui/dom";

export const Work = {
  async init() {
    injectStyles(
      `${CLASS_PREFIX}__styles--work-form`,
      getFormStyles(CLASS_PREFIX)
    );

    await setupWorkButtons();
  },
};
