import { ApplyMarksParams } from "../apply";
import { classRuleCollector } from "../../../../services/rules";
import type * as Classes from "../../../../constants/classes";

/**
 * Adds classes to a work element based on its finished/ignored/in-progress status.
 *
 * Classes are modified in {@link collectClassRules} and {@link Classes}
 */
export function addClasses(params: ApplyMarksParams) {
  for (const rule of classRuleCollector.collect(params)) {
    if (rule.shouldApply()) params.element.classList.add(rule.className);
  }
}

/** Removes any classes added by this module from a work element. */
export function removeClasses(element: HTMLElement) {
  for (const rule of classRuleCollector.collect({}))
    element.classList.remove(rule.className);
}
