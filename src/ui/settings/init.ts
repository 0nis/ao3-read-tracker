import { SETTINGS_PAGE_URL } from "../../constants/settings";
import { Router } from "../router";
import { addSettingsButtonToNav } from "./navigation";
import { render } from "./render";

export const Settings = {
  init() {
    addSettingsButtonToNav(SETTINGS_PAGE_URL);
    Router.register(SETTINGS_PAGE_URL, render);
  },
};
