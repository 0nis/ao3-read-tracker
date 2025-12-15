import {
  addWorkMetaGroupToArea,
  createWorkMetaDetailsList,
  createWorkMetaGroupElements,
} from "../create";
import { getItemsFromRules } from "../helpers";

import { detailsMetaRuleCollector } from "../../../../services/rules";
import { WorkStateData } from "../../../../types/works";

export function addDetails(data: WorkStateData, area: HTMLElement): void {
  const rules = detailsMetaRuleCollector.getActiveRules(data);
  if (rules.length === 0) return;

  addWorkMetaGroupToArea(
    area,
    createWorkMetaGroupElements({
      key: "details",
      label: "Details",
      children: createWorkMetaDetailsList({
        key: "details",
        items: getItemsFromRules(rules),
      }),
      className: "stats", // For native AO3 styling
    })
  );
}
