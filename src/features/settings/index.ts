import { Router } from "../../app/router";
import { CLASS_PREFIX } from "../../constants/classes";
import { SETTINGS_PAGE_URL } from "../../constants/settings";
import { el, injectStyles } from "../../utils/dom";
import { render } from "./renderer";
import { getStyles } from "./style";

export const PREFIX = `${CLASS_PREFIX}__settings`;

export const Settings = {
  init() {
    injectStyles(PREFIX, getStyles(PREFIX));
    addSettingsButtonToNav(SETTINGS_PAGE_URL);
    Router.register(SETTINGS_PAGE_URL, render);
  },
};

export function addSettingsButtonToNav(url: string): void {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;

  const button = el("a", {
    href: "#",
    textContent: "⚙️ Read Tracker",
  });
  button.addEventListener("click", (ev) => {
    ev.preventDefault();
    Router.navigate(url);
  });

  const li = el("li", {}, button);
  nav.appendChild(li);
}
