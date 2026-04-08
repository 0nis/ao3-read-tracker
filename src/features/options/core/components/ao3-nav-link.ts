import { Router } from "../../../../app/router";
import { getExtensionName } from "../../../../utils/extension";
import { el, ensureChild } from "../../../../utils/ui/dom";

/**
 * This function creates the "Extensions" dropdown if it doesn't exist already,
 * and adds our link to it.
 *
 * If another separate extension wishes to add a link to this dropdown, ensure that it is
 * implemented in the same way: create if it doesn't exist already, and fetch if it does.
 * Ensure that it is created with the same props and classes as AO3's native dropdowns.
 */
export async function addOptionsLinkToAo3Nav(url: string): Promise<void> {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;

  const search = nav.querySelector("li.search") as HTMLElement | null;

  // Add a new "extensions" dropdown before the search bar if it doesn't exist already.
  // If it exists already, merely fetch it.
  const dropdown = ensureChild({
    parent: nav as HTMLElement,
    className: "extensions",
    tag: "li",
    insertBefore: search || undefined,
    createProps: { attrs: { "aria-haspopup": "true" } },
  });
  if (!dropdown.classList.contains("dropdown"))
    dropdown.classList.add("dropdown");

  // Add the navigation element to the dropdown if it doesn't exist already.
  // If it exists already, merely fetch it.
  ensureChild({
    parent: dropdown,
    className: "dropdown-toggle",
    tag: "a",
    createProps: {
      textContent: "Extensions",
      attrs: {
        href: "/menu/extensions",
        "data-toggle": "dropdown",
        "data-target": "#",
      },
    },
  });

  // Add the link list to the dropdown if it doesn't exist already.
  // If it exists already, merely fetch it.
  const ul = ensureChild({
    parent: dropdown,
    className: "menu dropdown-menu",
    tag: "ul",
  });

  // Add our own extension link to the list
  const myLink = el("li", {}, [
    el("a", {
      href: url,
      textContent: getExtensionName(),
    }),
  ]);

  myLink.addEventListener("click", (ev) => {
    ev.preventDefault();
    Router.navigate(url);
  });

  ul.appendChild(myLink);
}
