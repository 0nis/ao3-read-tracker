import { addText } from "./marks/text";
import { addSymbols } from "./marks/symbols";
import { addClasses } from "./marks/classes";

import { DISPLAY_MODE_MAP } from "../config";

import { collectDisplayRules } from "../../../services/rules";
import { ensureChild } from "../../../utils/ui/dom";
import { getManifest } from "../../../utils/extension";
import { CLASS_PREFIX } from "../../../constants/classes";
import { SettingsData } from "../../../types/settings";
import { WorkStateData } from "../../../types/works";

export interface ApplyMarksParams extends WorkStateData {
  element: HTMLElement;
  settings: SettingsData;
}

export async function applyMarksToWork(params: ApplyMarksParams) {
  ensureLandmarkHeadingPresent(params.element);
  addClasses(params);
  addText(params);
  await addSymbols(params);
  adjustWorkDisplay(params);
}

function adjustWorkDisplay({
  element,
  readWork,
  inProgressWork,
  ignoredWork,
  settings,
}: ApplyMarksParams) {
  const rules = collectDisplayRules({
    settings,
    readWork,
    inProgressWork,
    ignoredWork,
  });
  // TODO: Create setting deciding what order these go in (which take priority)
  const rule = rules.find((r) => r.shouldApply());
  if (!rule) return;

  const displayFn = DISPLAY_MODE_MAP[rule.getMode()];
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
