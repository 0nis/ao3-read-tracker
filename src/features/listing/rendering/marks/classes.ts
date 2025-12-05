import { ApplyMarksParams } from "../apply";
import { collectClassRules } from "../../../../services/rules";

export function addClasses({
  element,
  readWork,
  inProgressWork,
  ignoredWork,
}: ApplyMarksParams) {
  const rules = collectClassRules({
    readWork,
    inProgressWork,
    ignoredWork,
  });

  for (const rule of rules) {
    if (rule.shouldApply()) element.classList.add(rule.className);
  }
}

export function removeClasses(element: HTMLElement) {
  for (const rule of collectClassRules({}))
    element.classList.remove(rule.className);
}
