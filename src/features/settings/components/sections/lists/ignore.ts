import { SectionId } from "../../../sections";
import { createListSection } from "./base";

export function buildIgnoreListSection(): HTMLElement {
  return createListSection({
    id: SectionId.IGNORE_LIST,
    title: "Ignored Works List",
  });
}
