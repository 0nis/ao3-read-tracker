import {
  addWorkMetaGroupToArea,
  createWorkMetaDetailsList,
  createWorkMetaGroupElements,
} from "../create";
import { WorkMetaDetailsListItem } from "../types";

import { metaGroupRuleCollector } from "../../../../services/rules";
import { warn } from "../../../../utils/extension";
import { WorkStateData } from "../../../../types/works";

export function addDetailsToWorkMetaArea(data: WorkStateData): void {
  const workMetaArea =
    document.querySelector<HTMLElement>("dl.work.meta.group");
  if (!workMetaArea) {
    warn(
      "Default AO3 work meta area not found. Skipping meta details addition."
    );
    return;
  }

  for (const groupRule of metaGroupRuleCollector.getActiveRules(data)) {
    if (!groupRule.getRules().length) continue;

    const items: Record<string, WorkMetaDetailsListItem> = groupRule
      .getRules()
      .reduce((acc, rule) => {
        acc[rule.key] = {
          label: rule.label,
          value: rule.getValue(),
        };
        return acc;
      }, {} as Record<string, WorkMetaDetailsListItem>);

    addWorkMetaGroupToArea(
      workMetaArea,
      createWorkMetaGroupElements({
        key: groupRule.key,
        label: groupRule.label,
        children: createWorkMetaDetailsList({
          key: groupRule.key,
          items,
        }),
        className: "stats",
      })
    );
  }
}
