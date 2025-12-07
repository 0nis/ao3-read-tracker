import { NavGroup } from "../../types";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { reportSrLive } from "../../../../utils/ui/accessibility";
import { getSymbolElement } from "../../../../utils/ui/symbols";
import { SymbolId } from "../../../../enums/symbols";
import { getStyles } from "./style";

const NAV_CLASS = `${CLASS_PREFIX}__nav`;

// TODO: Improve responsiveness for mobile

export async function buildNav(groups: NavGroup[]): Promise<{
  nav: HTMLElement;
  updateSelected: (id: string) => void;
}> {
  injectStyles(`${CLASS_PREFIX}__styles--nav`, getStyles(NAV_CLASS));

  const nav = el("aside", {
    className: `${NAV_CLASS}`,
    attrs: { role: "navigation", "aria-label": "Settings navigation" },
  });

  const container = el("div", { className: `${NAV_CLASS}__groups` });

  groups.forEach((group) => {
    const section = el("div", { className: `${NAV_CLASS}__group` });

    const heading = el("h3", { className: `${NAV_CLASS}__group-label` }, [
      group.label,
    ]);

    const ul = el("ul");

    group.items.forEach((it) => {
      const li = el("li");
      const a = el("a", { href: `#${it.id}` }, [it.label]);

      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = it.id;

        nav
          .querySelectorAll("a")
          .forEach((link) => link.classList.remove("selected"));

        a.classList.add("selected");
        reportSrLive(`Navigated to ${it.label} section`);
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    section.appendChild(heading);
    section.appendChild(ul);
    container.appendChild(section);
  });

  container.querySelector("a")?.classList.add("selected");

  nav.prepend(await buildToggleEl(nav));
  nav.appendChild(container);

  function updateSelected(id: string) {
    nav.querySelectorAll("a").forEach((link) => {
      const linkHash = link.getAttribute("href")?.slice(1);
      link.classList.toggle("selected", linkHash === id);
    });
  }

  return { nav, updateSelected };
}

async function buildToggleEl(nav: HTMLElement): Promise<HTMLElement> {
  const hamburgerEl = await getSymbolElement(SymbolId.HAMBURGER, "☰");
  const toggleBtn = el(
    "button",
    {
      className: `${NAV_CLASS}-toggle`,
      attrs: {
        "aria-label": "Toggle navigation menu",
        "aria-expanded": "false",
      },
    },
    [hamburgerEl]
  );

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle(`${NAV_CLASS}--open`);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  return toggleBtn;
}
