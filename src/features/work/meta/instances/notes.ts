import { addWorkMetaGroupToArea, createWorkMetaGroupElements } from "../create";
import { WorkContext } from "../setup";

import { workNotesRuleCollector } from "../../../../services/rules";
import { el } from "../../../../utils/dom";

export function addNotes(context: WorkContext, area: HTMLElement): void {
  const rules = workNotesRuleCollector.getActiveRules(context);
  if (rules.length === 0) return;

  const noteEls = rules.map((rule) =>
    el("p", { className: rule.className }, [rule.getText()]),
  );

  addWorkMetaGroupToArea(
    area,
    createWorkMetaGroupElements({
      key: "notes",
      label: "User Notes",
      children: noteEls,
    }),
  );
}
