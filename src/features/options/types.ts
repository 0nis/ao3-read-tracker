import { SectionId } from "./config";

export interface SectionConfig {
  id: SectionId;
  title: string;
  description?: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
