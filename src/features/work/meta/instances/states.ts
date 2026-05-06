import {
  addWorkMetaGroupToArea,
  createWorkMetaDetailsList,
  createWorkMetaGroupElements,
} from "../create";
import { getItemsFromRules } from "../helpers";
import { WorkContext } from "../setup";

import { stateMetaRuleCollector } from "../../../../services/rules";

export function addStates(context: WorkContext, area: HTMLElement): void {
  const rules = stateMetaRuleCollector.getActiveRules(context);
  if (rules.length === 0) return;

  addWorkMetaGroupToArea(
    area,
    createWorkMetaGroupElements({
      key: "states",
      label: "States",
      children: createWorkMetaDetailsList({
        key: "states",
        items: getItemsFromRules(rules),
      }),
      className: "stats", // For native AO3 styling
    }),
  );
}
