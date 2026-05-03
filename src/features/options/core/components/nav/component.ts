import { getStyles } from "./style";
import { NavGroup } from "../../../types";

import { el, injectStyles } from "../../../../../utils/dom";
import { reportSrLive } from "../../../../../utils/srLive";
import { renderSymbolContentById } from "../../../../../ui/components/symbols";
import { SymbolId } from "../../../../../enums/symbols";
import { CLASS_PREFIX } from "../../../../../constants/classes";
import { DEFAULT_SYMBOL_SIZE_EM } from "../../../../../constants/global";

const getClass = () => `${CLASS_PREFIX}__nav`;

export async function buildNav(groups: NavGroup[]): Promise<{
  nav: HTMLElement;
  updateSelected: (id: string) => void;
}> {
  injectStyles(`${CLASS_PREFIX}__styles--options-nav`, getStyles(getClass()));

  const nav = el(
    "aside",
    {
      className: `${getClass()}`,
      attrs: { role: "navigation", "aria-label": "Settings navigation" },
    },
    el("h3", {
      className: `${getClass()}__header`,
      textContent: "Navigation",
    }),
  );

  const container = el("div", { className: `${getClass()}__groups` });

  groups.forEach((group) => {
    const section = el("div", { className: `${getClass()}__group` });

    const heading = el("h4", { className: `${getClass()}__group-label` }, [
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

export async function buildNavToggleEl(nav: HTMLElement): Promise<HTMLElement> {
  const hamburgerEl = await renderSymbolContentById(SymbolId.HAMBURGER, "☰", {
    sizeOverride: DEFAULT_SYMBOL_SIZE_EM,
  });
  const closeEl = await renderSymbolContentById(SymbolId.CLOSE, "✕", {
    sizeOverride: DEFAULT_SYMBOL_SIZE_EM,
  });

  const toggleBtn = el(
    "button",
    {
      className: `${getClass()}-toggle`,
      attrs: {
        "aria-label": "Toggle navigation menu",
        "aria-expanded": "false",
      },
    },
    [hamburgerEl],
  );

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle(`${getClass()}--open`);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));

    toggleBtn.textContent = "";
    toggleBtn.appendChild(
      isOpen ? closeEl.cloneNode(true) : hamburgerEl.cloneNode(true),
    );
  });

  return toggleBtn;
}
