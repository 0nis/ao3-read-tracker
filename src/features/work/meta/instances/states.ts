import {
  addWorkMetaGroupToArea,
  createWorkMetaDetailsList,
  createWorkMetaGroupElements,
} from "../create";
import { getItemsFromRules } from "../helpers";

import { stateMetaRuleCollector } from "../../../../services/rules";
import { WorkStateData } from "../../../../types/works";

export function addStates(data: WorkStateData, area: HTMLElement): void {
  const rules = stateMetaRuleCollector.getActiveRules(data);
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
    })
  );
}
