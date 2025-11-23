import { createSection, SectionConfig } from "../helpers";

export interface ListSectionConfig extends SectionConfig {}

export function createListSection(config: ListSectionConfig): HTMLElement {
  const section = createSection(config);
  return section;
}
