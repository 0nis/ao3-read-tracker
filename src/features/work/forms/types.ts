import type { WorkAction } from "../config";
import type { ButtonPlacement } from "../../../enums/settings";
import type {
  FormConfig,
  FormField,
  FormGroup,
  FormItem,
} from "../../../types/forms";

export interface WorkFormField<T> extends FormField<T> {}

export interface WorkFormFieldGroup<T>
  extends FormGroup<T, WorkFormField<T>, WorkFormFieldGroup<T>> {
  className?: string;
}

export type WorkFormItem<T> = FormItem<
  T,
  WorkFormField<T>,
  WorkFormFieldGroup<T>
>;

export interface WorkFormConfig<T>
  extends FormConfig<T, WorkFormField<T>, WorkFormFieldGroup<T>> {
  id: WorkAction;
  landmark: string;
  heading: string;
  editing: boolean;
  submit: {
    save: {
      label: string;
      ariaLabel: string;
      onSave?: (form: HTMLFormElement) => Promise<void>;
    };
    delete: {
      isDeletable: boolean;
      label: string;
      ariaLabel: string;
      onDelete?: (form: HTMLFormElement) => Promise<void>;
    };
  };
  origin?: ButtonPlacement;
}
