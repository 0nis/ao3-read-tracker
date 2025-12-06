import { PREFIX } from ".";
import { NAV_CONFIG, SECTION_CONFIG, SectionId, SectionType } from "./config";
import { buildHeader } from "./components/header";
import { buildNav } from "./components/nav";

import { error, addGlobalListener, getManifest } from "../../utils/extension";
import { hijackAo3Page } from "../../utils/ao3";
import { el } from "../../utils/ui/dom";
import { ABBREVIATION } from "../../constants/global";
import { NavGroup, NavItem } from "./types";

export type SectionElements = {
  [key in SectionId]: {
    element: HTMLElement;
    type: SectionType;
  };
};

export async function render(): Promise<void> {
  const extensionName =
    getManifest().data?.name?.replace(/^AO3\s+/i, "") || "Read Tracker";
  const main = hijackAo3Page(`Settings - ${extensionName}`, "settings-page");
  if (!main) {
    error("Failed to render options page: #main element not found");
    return;
  }

  const header = buildHeader(extensionName);

  const entries = await Promise.all(
    SECTION_CONFIG.map(async ({ id, build, type }) => {
      const element = await build();
      return [id, { element, type }] as const;
    })
  );
  const sections = Object.fromEntries(entries) as SectionElements;

  const navGroups: NavGroup[] = NAV_CONFIG.map((group) => {
    const items: NavItem[] = SECTION_CONFIG.filter(
      (section) => section.type === group.type
    ).map((section) => ({
      id: section.id,
      label: section.label,
    }));
    return items.length ? { label: group.label, items } : null;
  }).filter((g): g is NavGroup => g !== null);

  const { nav, updateSelected } = buildNav(navGroups);

  const wrapper = el("div", { className: `${PREFIX}__wrapper` }, [
    nav,
    el(
      "div",
      { className: `${PREFIX}__content` },
      Object.values(sections).map((s) => s.element)
    ),
  ]);

  main.append(header, wrapper);

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
