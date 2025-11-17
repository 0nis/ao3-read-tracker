import { Listing } from "./listing";
import { Router } from "./router";
import { Settings } from "./settings";
import { addStyles } from "./style";
import { Work } from "./work";

export const UI = {
  init() {
    addStyles();
    Settings.init();
    Router.setup();
    Listing.init();
    Work.init();
  },
};
