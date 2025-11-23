import { CLASS_PREFIX } from "../constants/classes";
import { Listing } from "../features/listing";
import { Settings } from "../features/settings";
import { Work } from "../features/work";
import { injectStyles } from "../utils/ui/dom";
import { Router } from "./router";
import { getGlobalStyles } from "./style";

export const App = {
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
