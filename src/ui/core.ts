import { CLASS_PREFIX } from "../constants/classes";
import { injectStyles } from "../utils/dom";
import { Listing } from "./listing";
import { Router } from "./router";
import { Settings } from "./settings";
import { getGlobalStyles } from "./style";
import { Work } from "./work";

export const UI = {
  init() {
    injectStyles(
      `${CLASS_PREFIX}__styles--global`,
      getGlobalStyles(CLASS_PREFIX)
    );
    Settings.init();
    Router.setup();
    Listing.init();
    Work.init();
  },
};
