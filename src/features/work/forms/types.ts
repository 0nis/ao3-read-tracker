import { WorkAction } from "../config";

export enum WorkFormFieldType {
  FIELD = "field",
  GROUP = "group",
}

interface WorkFormFieldBase {
  type: WorkFormFieldType;
}

export interface WorkFormField<T> extends WorkFormFieldBase {
  type: WorkFormFieldType.FIELD;
  dataField: keyof T;
  label: string;
  input: HTMLElement;
  description?: string;
}

export interface WorkFormFieldGroup<T> extends WorkFormFieldBase {
  type: WorkFormFieldType.GROUP;
  className?: string;
  fields: Array<WorkFormField<T> | WorkFormFieldGroup<T>>;
}

export type WorkFormItem<T> = WorkFormField<T> | WorkFormFieldGroup<T>;

export interface WorkFormConfig<T> {
  id: WorkAction;
  landmark: string;
  heading: string;
  data: Partial<T>;
  editing: boolean;
  items: WorkFormItem<T>[];
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
}
