import { CLASS_PREFIX } from "../../../constants/classes";
import { injectStyles } from "../../../utils/ui/dom";
import { setupWorkButtons } from "../buttons/setup";
import { getFormStyles } from "./style";

export const Forms = {
  async init() {
    injectStyles(
      `${CLASS_PREFIX}__styles--work-form`,
      getFormStyles(CLASS_PREFIX)
    );

    await setupWorkButtons();
  },
};
