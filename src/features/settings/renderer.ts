import { PREFIX } from ".";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";

import { StorageService } from "../../services/storage";
import { hijackAo3Page } from "../../utils/ao3";
import {
  confirmDestructiveAction,
  showNotification,
} from "../../utils/dialogs";
import { extractSectionValues, populateSection } from "../../utils/form";
import { el } from "../../utils/dom";

import { getSettingsHandler, updateSettingsHandler } from "./handlers";

import { buildReadSection } from "./components/sections/read";
import { buildIgnoreSection } from "./components/sections/ignore";
import { buildGeneralSection } from "./components/sections/general";
import { buildTopbar } from "./components/topBar";
import { buildNav } from "./components/nav";
import { getManifest } from "../../utils/manifest";

export async function render(): Promise<void> {
  const extensionName = getManifest().data?.name || "Mark as Read";
  const main = hijackAo3Page(`Settings - ${extensionName}`, "settings-page");
  if (!main) return;

  const heading = document.createElement("h2");
  heading.textContent = `⚙️ ${extensionName} Settings`;

  const { topbar, exportBtn, importBtn, clearBtn } = buildTopbar();
  const readSection = buildReadSection();
  const ignoreSection = buildIgnoreSection();
  const generalSection = buildGeneralSection();

  const sections = {
    read: readSection,
    ignore: ignoreSection,
    general: generalSection,
  };

  const nav = buildNav(
    [
      { id: "read", label: "Read Settings" },
      { id: "ignore", label: "Ignore Settings" },
      { id: "general", label: "General" },
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

  main.append(heading, topbar, wrapper);

  await loadAllSections(readSection, ignoreSection, generalSection);
  setupSaveHandlers(readSection, ignoreSection, generalSection);
  setupTopbarActions(exportBtn, importBtn, clearBtn);

  function showSection(id: string) {
    for (const key of Object.keys(sections) as Array<keyof typeof sections>) {
      sections[key].style.display = key === id ? "" : "none";
    }
  }

  showSection((window.location.hash || "#read").slice(1));
  window.addEventListener("hashchange", () =>
    showSection((window.location.hash || "#read").slice(1))
  );
}

export async function loadAllSections(
  readSection: HTMLElement,
  ignoreSection: HTMLElement,
  generalSection: HTMLElement
) {
  const read = await getSettingsHandler(
    StorageService.readSettings.get,
    DEFAULT_READ_SETTINGS,
    "Read"
  );
  populateSection(readSection, read!);

  const ignore = await getSettingsHandler(
    StorageService.ignoreSettings.get,
    DEFAULT_IGNORE_SETTINGS,
    "Ignore"
  );
  populateSection(ignoreSection, ignore!);

  const general = await getSettingsHandler(
    StorageService.generalSettings.get,
    DEFAULT_GENERAL_SETTINGS,
    "General"
  );
  populateSection(generalSection, general!);
}

export function setupSaveHandlers(
  readSection: HTMLElement,
  ignoreSection: HTMLElement,
  generalSection: HTMLElement
) {
  const readSave = readSection.querySelector("button")!;
  readSave.addEventListener("click", async () => {
    const values = extractSectionValues(readSection);
    const payload = { ...DEFAULT_READ_SETTINGS, ...values };
    await updateSettingsHandler(
      StorageService.readSettings.set,
      payload,
      "Read"
    );
  });

  const ignoreSave = ignoreSection.querySelector("button")!;
  ignoreSave.addEventListener("click", async () => {
    const values = extractSectionValues(ignoreSection);
    const payload = { ...DEFAULT_IGNORE_SETTINGS, ...values };
    await updateSettingsHandler(
      StorageService.ignoreSettings.set,
      payload,
      "Ignore"
    );
  });

  const generalSave = generalSection.querySelector("button")!;
  generalSave.addEventListener("click", async () => {
    const values = extractSectionValues(generalSection);
    const payload = { ...DEFAULT_GENERAL_SETTINGS, ...values };
    await updateSettingsHandler(
      StorageService.generalSettings.set,
      payload,
      "General"
    );
  });
}

export function setupTopbarActions(
  exportBtn: HTMLButtonElement,
  importBtn: HTMLButtonElement,
  clearBtn: HTMLButtonElement
) {
  exportBtn.addEventListener("click", () => {
    // TODO: Implement data exporting logic
    showNotification("Exporting data...");
  });
  importBtn.addEventListener("click", async () => {
    const confirmed = await confirmDestructiveAction(
      "Importing data will overwrite your existing data. Are you sure you want to proceed?",
      "IMPORT DATA"
    );
    if (confirmed) {
      // TODO: Implement data importing logic
      showNotification("Importing data...");
    } else showNotification("Data import action cancelled.");
  });
  clearBtn.addEventListener("click", async () => {
    const confirmed = await confirmDestructiveAction(
      "Are you sure you want to clear all stored data? This action cannot be undone.",
      "DELETE MY DATA"
    );
    if (confirmed) {
      showNotification("All stored data has been cleared.");
      // TODO: Implement data clearing logic
    } else showNotification("Data clear action cancelled.");
  });
}
