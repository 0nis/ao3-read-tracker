import { render } from "./renderer";
import { getStyles } from "./style";
import { Router } from "../../app/router";

import { getManifest } from "../../utils/extension/manifest";
import { el, getSymbolElement, injectStyles } from "../../utils/ui/dom";

import { SymbolId } from "../../enums/symbols";

import { CLASS_PREFIX } from "../../constants/classes";
import { SETTINGS_PAGE_URL } from "../../constants/global";

export const PREFIX = `${CLASS_PREFIX}__options`;

export const Options = {
  async init() {
    injectStyles(PREFIX, getStyles(PREFIX));
    await addOptionsButtonToNav(SETTINGS_PAGE_URL);
    Router.register(SETTINGS_PAGE_URL, render);
  },
};

export async function addOptionsButtonToNav(url: string): Promise<void> {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;

  const symbolElement = await getSymbolElement(SymbolId.EXTENSION, "🧩");
  const extensionName =
    getManifest()?.data?.name?.replace(/^AO3\s+/i, "") || "Extension";

  const button = el(
    "a",
    {
      href: "#",
    },
    [symbolElement, el("span", { textContent: ` ${extensionName} Options` })]
  );
  button.addEventListener("click", (ev) => {
    ev.preventDefault();
    Router.navigate(url);
  });

  const li = el("li", {}, button);
  nav.appendChild(li);
}
