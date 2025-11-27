import { hijackAo3Page } from "@utils/ao3";
import { el } from "@utils/ui";
import { getManifest } from "@utils/extension";

import { PREFIX } from ".";
import {
  SECTION_CONFIG,
  SectionElements,
  SectionId,
  SectionType,
} from "./config";
import { setupHeaderActions } from "./handlers";
import { setupSettings } from "./settings";
import { buildHeader } from "./components/header";
import { buildNav } from "./components/nav";

export async function render(): Promise<void> {
  const extensionName =
    getManifest().data?.name?.replace(/^AO3\s+/i, "") || "Read Tracker";
  const main = hijackAo3Page(`Settings - ${extensionName}`, "settings-page");
  if (!main) return;

  const { header, exportBtn, importBtn, clearBtn } = buildHeader(extensionName);

  const entries = await Promise.all(
    SECTION_CONFIG.map(async ({ id, build, type }) => {
      const element = await build();
      return [id, { element, type }] as const;
    })
  );
  const sections = Object.fromEntries(entries) as SectionElements;

  const { nav, updateSelected } = buildNav(
    SECTION_CONFIG.map(({ id, label }) => ({ id, label }))
  );

  const wrapper = el("div", { className: `${PREFIX}__wrapper` }, [
    nav,
    el(
      "div",
      { className: `${PREFIX}__content` },
      Object.values(sections).map((s) => s.element)
    ),
  ]);

  main.append(header, wrapper);

  await setupSettings(sections);
  setupHeaderActions(exportBtn, importBtn, clearBtn);

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

  window.addEventListener("hashchange", () => {
    showSection(getCurrentSection());
  });

  showSection(getCurrentSection());
}
