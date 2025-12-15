import { addWorkMetaGroupToArea, createWorkMetaGroupElements } from "../create";

import { workNotesRuleCollector } from "../../../../services/rules";
import { el } from "../../../../utils/ui/dom";
import { WorkStateData } from "../../../../types/works";

export function addNotes(data: WorkStateData, area: HTMLElement): void {
  const rules = workNotesRuleCollector.getActiveRules(data);
  if (rules.length === 0) return;

  const noteEls = rules.map((rule) =>
    el("p", { className: rule.className }, [rule.getText()])
  );

  addWorkMetaGroupToArea(
    area,
    createWorkMetaGroupElements({
      key: "notes",
      label: "User Notes",
      children: noteEls,
    })
  );
}
