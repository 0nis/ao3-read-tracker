import type { SectionId } from "../../config";
import type { SectionConfig } from "../../types";
import type {
  FormConfig,
  FormField,
  FormGroup,
  FormItem,
} from "../../../../ui/forms/types";
import { VerticalPlacement } from "../../../../enums/settings";

export interface SettingsSectionBaseItem<T> {
  sectionId: SectionId;
}

export interface SettingsSectionField<T>
  extends SettingsSectionBaseItem<T>, FormField<T> {
  orientation?: "vertical" | "horizontal";
}

export interface SettingsSectionGroup<T>
  extends
    SettingsSectionBaseItem<T>,
    FormGroup<T, SettingsSectionField<T>, SettingsSectionGroup<T>> {
  id: string;
  label: string;
  description?: string;
  boldFieldLabels?: boolean;
  collapsible?: boolean;
  collapsedByDefault?: boolean;
}

export type SettingsSectionItem<T> = FormItem<
  T,
  SettingsSectionField<T>,
  SettingsSectionGroup<T>
>;

export interface SettingsSectionConfig<T>
  extends
    SectionConfig,
    FormConfig<T, SettingsSectionField<T>, SettingsSectionGroup<T>> {
  saveButtonPlacement?: VerticalPlacement;
}
