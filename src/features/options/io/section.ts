import { createSection } from "../components/section";
import { SectionId } from "../config";

export function buildDataSection() {
  return createSection({
    id: SectionId.DATA,
    title: "Data & Storage",
  });
}
