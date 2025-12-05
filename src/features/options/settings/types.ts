import type { SectionId } from "../config";
import type { SectionConfig } from "../types";
import type {
  FormConfig,
  FormField,
  FormGroup,
  FormItem,
} from "../../../types/forms";

export interface SettingsSectionBaseItem<T> {
  sectionId: SectionId;
}

export interface SettingsSectionField<T>
  extends SettingsSectionBaseItem<T>,
    FormField<T> {}

export interface SettingsSectionGroup<T>
  extends SettingsSectionBaseItem<T>,
    FormGroup<T, SettingsSectionField<T>, SettingsSectionGroup<T>> {
  id: string;
  label: string;
  description?: string;
}

export type SettingsSectionItem<T> = FormItem<
  T,
  SettingsSectionField<T>,
  SettingsSectionGroup<T>
>;

export interface SettingsSectionConfig<T>
  extends SectionConfig,
    FormConfig<T, SettingsSectionField<T>, SettingsSectionGroup<T>> {}
