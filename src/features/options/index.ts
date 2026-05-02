import { render } from "./renderer";
import { getStyles } from "./style";
import { addOptionsLinkToAo3Nav } from "./core/components/ao3-nav-link";

import { Router } from "../../app/router";
import { injectStyles } from "../../utils/dom";

import { CLASS_PREFIX } from "../../constants/classes";
import { SETTINGS_PAGE_PATH } from "../../constants/global";

export const Options = {
  async init() {
    injectStyles(`${CLASS_PREFIX}__styles--options`, getStyles(CLASS_PREFIX));
    await addOptionsLinkToAo3Nav(SETTINGS_PAGE_PATH);
    Router.register(SETTINGS_PAGE_PATH, render);
  },
};
