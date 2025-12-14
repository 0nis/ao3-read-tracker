import { workNotesRuleCollector } from "../../../../services/rules";
import { WorkStateData } from "../../../../types/works";
import { el } from "../../../../utils/ui/dom";
import {
  addWorkMetaGroupToArea,
  createWorkMetaArea,
  createWorkMetaGroupElements,
  insertNewWorkMetaArea,
} from "../create";

export async function createNotesInNewWorkMetaArea(
  data: WorkStateData
): Promise<void> {
  const rules = workNotesRuleCollector.getActiveRules(data);
  if (rules.length === 0) return;

  const wrapper = createWorkMetaArea("notes");
  const area = wrapper.querySelector<HTMLElement>("dl")!;

  for (const rule of rules) {
    addWorkMetaGroupToArea(
      area,
      createWorkMetaGroupElements({
        key: rule.label.toLowerCase().split(" ")[0],
        label: rule.label,
        children: el("p", { className: rule.className }, [rule.getText()]),
      })
    );
  }

  insertNewWorkMetaArea(wrapper);
}
