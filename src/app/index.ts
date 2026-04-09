import { Router } from "./router";
import { getGlobalStyles } from "./style";

import { Listing } from "../features/listing";
import { Options } from "../features/options";
import { Work } from "../features/work";

import { error } from "../shared/extension/logger";
import { injectStyles } from "../utils/ui/dom";
import { initSrLive } from "../utils/ui/accessibility";

import { CLASS_PREFIX } from "../constants/classes";

export const App = {
  async init() {
    const main = document.getElementById("main");
    if (!main) {
      error(
        "Could not find #main element. The extension will not run on this page.",
      );

      return;
    }

    injectStyles(
      `${CLASS_PREFIX}__styles--global`,
      getGlobalStyles(CLASS_PREFIX),
    );
    initSrLive();

    await Promise.all([Options.init(), Listing.init(main), Work.init(main)]);

    Router.setup();
  },
};
