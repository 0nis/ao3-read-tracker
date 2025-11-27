import { Router } from "../../../app/router";
import { SymbolId } from "../../../enums/symbols";
import { getManifest } from "../../../utils/extension/manifest";
import { el } from "../../../utils/ui/dom";
import { getSymbolElement } from "../../../utils/ui/symbols";

export async function addOptionsLinkToAo3Nav(url: string): Promise<void> {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;

  const symbolElement = await getSymbolElement(SymbolId.EXTENSION, "🧩");
  const extensionName =
    getManifest()?.data?.name?.replace(/^AO3\s+/i, "") || "Extension";

  const button = el(
    "a",
    {
      href: url,
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
