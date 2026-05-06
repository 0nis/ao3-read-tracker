import type { FormItemType } from "./enums";

interface FormItemBase<T> {
  type: FormItemType;
}

export interface FormField<T> extends FormItemBase<T> {
  type: FormItemType.FIELD;
  dataField: LeafPath<T>;
  input: HTMLElement;
  label: string;
  description?: string;
}

export interface FormGroup<
  T,
  FIELD extends FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP>,
> extends FormItemBase<T> {
  type: FormItemType.GROUP;
  fields: Array<FormItem<T, FIELD, GROUP>>;
}

export type FormItem<
  T,
  FIELD extends FormField<T> = FormField<T>,
  GROUP extends FormGroup<T, FIELD, GROUP> = FormGroup<T, FIELD, GROUP>,
> = FIELD | GROUP;

export interface FormConfig<
  T,
  FIELD extends FormField<T> = FormField<T>,
  GROUP extends FormGroup<T, FIELD> = FormGroup<T, FIELD>,
> {
  data: Partial<T>;
  items: Array<FormItem<T, FIELD, GROUP>>;
}

type IsPlainObject<T> = T extends object
  ? T extends any[]
    ? false
    : T extends Function
      ? false
      : T extends Date
        ? false
        : true
  : false;

type LeafPath<T> = {
  [K in keyof T & string]: IsPlainObject<T[K]> extends true
    ? `${K}.${LeafPath<T[K]>}`
    : K;
}[keyof T & string];
