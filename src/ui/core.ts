import { Listing } from "./listing";
import { Router } from "./router";
import { Settings } from "./settings";
import { Work } from "./work";

export const UI = {
  init() {
    Settings.init();
    Router.setup();
    Listing.init();
    Work.init();
  },
};
