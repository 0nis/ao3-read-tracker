import { PREFIX } from ".";
import { hijackAo3Page } from "../../utils/ao3";
import { el } from "../../utils/ui/dom";
import { getManifest } from "../../utils/extension/manifest";

import {
  loadAllSections,
  setupSaveHandlers,
  setupHeaderActions,
} from "./handlers";

import { buildReadSection } from "./components/sections/settings/read";
import { buildIgnoreSection } from "./components/sections/settings/ignore";
import { buildGeneralSection } from "./components/sections/settings/general";
import { buildHeader } from "./components/header";
import { buildNav } from "./components/nav";

export async function render(): Promise<void> {
  const extensionName = getManifest().data?.name || "Mark as Read";
  const main = hijackAo3Page(`Settings - ${extensionName}`, "settings-page");
  if (!main) return;

  const { header, exportBtn, importBtn, clearBtn } = buildHeader(extensionName);
  const readSection = buildReadSection();
  const ignoreSection = buildIgnoreSection();
  const generalSection = buildGeneralSection();

  const sections = {
    "read-settings": readSection,
    "ignore-settings": ignoreSection,
    "general-settings": generalSection,
  };

  const nav = buildNav(
    [
      { id: "read-settings", label: "Read Settings" },
      { id: "ignore-settings", label: "Ignore Settings" },
      { id: "general-settings", label: "General Settings" },
      { id: "read-works", label: "Read Works List" },
      { id: "ignored-works", label: "Ignored Works List" },
    ],
    (id) => showSection(id)
  );

  const wrapper = el("div", { className: `${PREFIX}__wrapper` }, [
    nav,
    el("div", { className: `${PREFIX}__content` }, [
      readSection,
      ignoreSection,
      generalSection,
    ]),
  ]);

  main.append(header, wrapper);

  await loadAllSections(readSection, ignoreSection, generalSection);
  setupSaveHandlers(readSection, ignoreSection, generalSection);
  setupHeaderActions(exportBtn, importBtn, clearBtn);

  function showSection(id: string) {
    for (const key of Object.keys(sections) as Array<keyof typeof sections>) {
      sections[key].style.display = key === id ? "" : "none";
    }
  }

  showSection((window.location.hash || "#read-settings").slice(1));
  window.addEventListener("hashchange", () =>
    showSection((window.location.hash || "#read-settings").slice(1))
  );
}
