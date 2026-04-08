import { addText } from "./marks/text";
import { addSymbols } from "./marks/symbols";
import { addClasses } from "./marks/classes";

import { DISPLAY_MODE_MAP } from "../config";

import { displayRuleCollector } from "../../../services/rules";
import { ensureChild } from "../../../utils/ui/dom";
import { getManifest } from "../../../utils/extension";
import { CLASS_PREFIX } from "../../../constants/classes";
import { SettingsData } from "../../../types/settings";
import { WorkStateData } from "../../../types/works";
import { settingsCache } from "../../../services/cache";

export interface ApplyMarksParams extends WorkStateData {
  element: HTMLElement;
  settings: SettingsData;
}

/** Applies the following to a work element within a listing:
 * - landmark heading
 * - classes
 * - text indicators and notes
 * - symbols
 * - display adjustments
 */
export async function applyMarksToWork(params: ApplyMarksParams) {
  ensureLandmarkHeadingPresent(params.element);
  addClasses(params);
  addText(params);
  await addSymbols(params);
  await adjustWorkDisplay(params);
}

async function adjustWorkDisplay({
  element,
  finishedWork,
  inProgressWork,
  ignoredWork,
  settings,
}: ApplyMarksParams) {
  const rules = displayRuleCollector.collect({
    settings,
    finishedWork,
    inProgressWork,
    ignoredWork,
  });

  const { displayModeSettings } = await settingsCache.get();
  const priorities = displayModeSettings.priorities;

  const applicable = rules
    .filter((r) => r.shouldApply())
    .map((r) => ({
      mode: r.getMode(),
      priority: priorities[r.getMode()] ?? -Infinity,
    }));
  if (applicable.length === 0) return;

  const highest = applicable.reduce((a, b) =>
    b.priority > a.priority ? b : a,
  );

  const displayFn = DISPLAY_MODE_MAP[highest.mode];
  displayFn(element);
}

function ensureLandmarkHeadingPresent(element: HTMLElement) {
  ensureChild({
    parent: element,
    className: `${CLASS_PREFIX}__text-indicator__landmark`,
    tag: "h6",
    createProps: {
      className: "landmark heading",
      textContent: `${
        getManifest().data?.name || "Read Tracker"
      } Extension Information`,
    },
  });
}
