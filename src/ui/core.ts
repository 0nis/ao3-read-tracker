import { settings } from "./settings/init";
import { initializeNavigationButtons } from "./work/navigation";

export const UI = {
  init() {
    initializeNavigationButtons();
    settings.init();
  },
};
