import { Router } from "./router";
import { Settings } from "./settings/init";
import { initializeNavigationButtons } from "./work/navigation";

export const UI = {
  init() {
    Settings.init();
    Router.setup();

    initializeNavigationButtons();
  },
};
