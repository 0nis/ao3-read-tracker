import { NAV_CONFIG, SECTION_CONFIG, SectionId, SectionType } from "./config";
import { NavGroup, NavItem } from "./types";
import { buildHeader } from "./core/components/header/component";
import { buildNav, buildNavToggleEl } from "./core/components/nav/component";

import { getExtensionName } from "../../shared/extension/manifest";
import { error } from "../../shared/extension/logger";
import { addGlobalListener } from "../../utils/listeners";
import { hijackAo3Page } from "../../utils/ao3";
import { el } from "../../utils/ui/dom";

import { ABBREVIATION } from "../../constants/global";
import { CLASS_PREFIX } from "../../constants/classes";

export type SectionElements = {
  [key in SectionId]: {
    element: HTMLElement;
    type: SectionType;
  };
};

export async function render(): Promise<void> {
  const extensionName = getExtensionName();
  const main = hijackAo3Page(`Options - ${extensionName}`, "options-page");
  if (!main) {
    error("Failed to render options page: #main element not found");
    return;
  }
  main.style.overflow = "hidden";

  const header = buildHeader(extensionName);

  const entries = await Promise.all(
    SECTION_CONFIG.map(async ({ id, build, type }) => {
      const element = await build();
      return [id, { element, type }] as const;
    }),
  );
  const sections = Object.fromEntries(entries) as SectionElements;

  const navGroups: NavGroup[] = NAV_CONFIG.map((group) => {
    const items: NavItem[] = SECTION_CONFIG.filter(
      (section) => section.type === group.type,
    ).map((section) => ({
      id: section.id,
      label: section.label,
    }));
    return items.length ? { label: group.label, items } : null;
  }).filter((g): g is NavGroup => g !== null);

  const { nav, updateSelected } = await buildNav(navGroups);

  header.appendChild(await buildNavToggleEl(nav));

  const wrapper = el("div", { className: `${CLASS_PREFIX}__wrapper` }, [
    header,
    nav,
    el(
      "div",
      { className: `${CLASS_PREFIX}__content` },
      Object.values(sections).map((s) => s.element),
    ),
  ]);

  main.append(wrapper);

  function getCurrentSection() {
    const hash = window.location.hash.slice(1);
    return hash || Object.keys(sections)[0];
  }

  function showSection(id: string) {
    for (const key of Object.keys(sections) as Array<keyof typeof sections>) {
      sections[key].element.style.display = key === id ? "" : "none";
    }
    updateSelected(id);
  }

  const handleHashChange = () => {
    showSection(getCurrentSection());
  };
  addGlobalListener(window, "hashchange", handleHashChange);

  const hash = getCurrentSection();
  location.replace(location.pathname + location.search + "#" + hash);
  showSection(hash);

  document.dispatchEvent(new CustomEvent(`${ABBREVIATION}:loaded`));
}
