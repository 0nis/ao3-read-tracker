import { CLASS_PREFIX } from "@constants";
import { injectStyles, initSrLive } from "@utils/ui";

import { Router } from "./router";
import { getGlobalStyles } from "./style";

import { Listing } from "../features/listing";
import { Options } from "../features/options";
import { Work } from "../features/work";

export const App = {
  async init() {
    injectStyles(
      `${CLASS_PREFIX}__styles--global`,
      getGlobalStyles(CLASS_PREFIX)
    );
    initSrLive();

    await Promise.all([Options.init(), Listing.init(), Work.init()]);

    Router.setup();
  },
};
