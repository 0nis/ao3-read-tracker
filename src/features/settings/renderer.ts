import { PREFIX } from ".";
import { hijackAo3Page } from "../../utils/ao3";
import { el } from "../../utils/ui/dom";
import { getManifest } from "../../utils/extension/manifest";

import {
  loadAllSettingsSections,
  setupSettingsSaveHandlers,
  setupHeaderActions,
} from "./handlers";

import { buildHeader } from "./components/header";
import { buildNav } from "./components/nav";
import { SECTION_CONFIG, SectionId, SectionType } from "./sections";

export type SectionElements = {
  [key in SectionId]: {
    element: HTMLElement;
    type: SectionType;
  };
};

export async function render(): Promise<void> {
  const extensionName = getManifest().data?.name || "Mark as Read";
  const main = hijackAo3Page(`Settings - ${extensionName}`, "settings-page");
  if (!main) return;

  const { header, exportBtn, importBtn, clearBtn } = buildHeader(extensionName);

  const sections = Object.fromEntries(
    SECTION_CONFIG.map(({ id, build, type }) => [
      id,
      { element: build(), type },
    ])
  ) as SectionElements;

  const nav = buildNav(
    SECTION_CONFIG.map(({ id, label }) => ({ id, label })),
    showSection
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

  const settingsSections = Object.keys(sections)
    .filter((key) => sections[key as SectionId].type === SectionType.SETTINGS)
    .reduce((obj, key) => {
      obj[key as SectionId] = sections[key as SectionId];
      return obj;
    }, {} as SectionElements);

  await loadAllSettingsSections(settingsSections);
  setupSettingsSaveHandlers(settingsSections);
  setupHeaderActions(exportBtn, importBtn, clearBtn);

  function showSection(id: string) {
    for (const key of Object.keys(sections) as Array<keyof typeof sections>) {
      sections[key].element.style.display = key === id ? "" : "none";
    }
  }

  showSection((window.location.hash || `#${SectionId.READ_SETTINGS}`).slice(1));
  window.addEventListener("hashchange", () =>
    showSection(
      (window.location.hash || `#${SectionId.READ_SETTINGS}`).slice(1)
    )
  );
}
