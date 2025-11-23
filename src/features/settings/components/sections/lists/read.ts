import { SectionId } from "../../../sections";
import { createListSection } from "./base";

export function buildReadListSection(): HTMLElement {
  return createListSection({
    id: SectionId.READ_LIST,
    title: "Read Works List",
  });
}
