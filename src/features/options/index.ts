import { Router } from "@app/router";
import { CLASS_PREFIX, SETTINGS_PAGE_URL } from "@constants";
import { injectStyles } from "@utils/ui";

import { render } from "./renderer";
import { getStyles } from "./style";
import { addOptionsLinkToAo3Nav } from "./components/ao3-nav-link";

export const PREFIX = `${CLASS_PREFIX}__options`;

export const Options = {
  async init() {
    injectStyles(PREFIX, getStyles(PREFIX));
    await addOptionsLinkToAo3Nav(SETTINGS_PAGE_URL);
    Router.register(SETTINGS_PAGE_URL, render);
  },
};
