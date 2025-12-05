import { ApplyMarksParams } from "../apply";
import { collectClassRules } from "../../../../services/rules";
import type * as Classes from "../../../../constants/classes";

/**
 * Adds classes to a work element based on its read/ignored/in-progress status.
 *
 * Classes are modified in {@link collectClassRules} and {@link Classes}
 */
export function addClasses(params: ApplyMarksParams) {
  for (const rule of collectClassRules(params)) {
    if (rule.shouldApply()) params.element.classList.add(rule.className);
  }
}

/** Removes any classes added by this module from a work element. */
export function removeClasses(element: HTMLElement) {
  for (const rule of collectClassRules({}))
    element.classList.remove(rule.className);
}
