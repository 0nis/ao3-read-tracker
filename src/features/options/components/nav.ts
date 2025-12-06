import { PREFIX } from "..";
import { NavGroup } from "../types";

import { el } from "../../../utils/ui/dom";
import { reportSrLive } from "../../../utils/ui/accessibility";

// TODO: Improve responsiveness for mobile

export function buildNav(groups: NavGroup[]): {
  nav: HTMLElement;
  updateSelected: (id: string) => void;
} {
  const nav = el("aside", {
    className: `${PREFIX}__nav`,
    attrs: { role: "navigation", "aria-label": "Settings navigation" },
  });

  const container = el("div", { className: `${PREFIX}__nav__groups` });

  groups.forEach((group) => {
    const section = el("div", { className: `${PREFIX}__nav__group` });

    const heading = el("h3", { className: `${PREFIX}__nav__group__label` }, [
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

  nav.appendChild(container);

  function updateSelected(id: string) {
    nav.querySelectorAll("a").forEach((link) => {
      const linkHash = link.getAttribute("href")?.slice(1);
      link.classList.toggle("selected", linkHash === id);
    });
  }

  return { nav, updateSelected };
}
