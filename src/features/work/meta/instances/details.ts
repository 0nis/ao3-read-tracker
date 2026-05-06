import {
  addWorkMetaGroupToArea,
  createWorkMetaDetailsList,
  createWorkMetaGroupElements,
} from "../create";
import { getItemsFromRules } from "../helpers";
import { WorkContext } from "../setup";

import { detailsMetaRuleCollector } from "../../../../services/rules";

export function addDetails(context: WorkContext, area: HTMLElement): void {
  const rules = detailsMetaRuleCollector.getActiveRules(context);
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
    }),
  );
}
