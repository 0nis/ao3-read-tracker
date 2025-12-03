import { WorkAction } from "../config";
import { ButtonPlacement } from "../../../enums/settings";
import { StorageResult } from "../../../types/results";

export enum ButtonAction {
  TOGGLE = "toggle",
  CLICK = "click",
}

interface BaseButtonConfig {
  type: WorkAction;
  labels: { on: string; off: string };
}

export interface ToggleButtonConfig extends BaseButtonConfig {
  mode: ButtonAction.TOGGLE;
  onActivate: (id: string, btn?: HTMLElement) => Promise<void>;
  onDeactivate: (id: string, btn?: HTMLElement) => Promise<void>;
}

export interface OpenFormButtonConfig extends BaseButtonConfig {
  mode: ButtonAction.CLICK;
  href: string;
  onClick: (id: string, btn?: HTMLElement) => Promise<void>;
}

export type ButtonConfig = ToggleButtonConfig | OpenFormButtonConfig;

export interface ActionButtonMeta {
  simple: ToggleButtonConfig;
  advanced: OpenFormButtonConfig;
}

export interface ActionLabelSet {
  simple: { on: string; off: string };
  advanced: { on: string; off: string };
}

export interface ActionHandlerEntry<T> {
  storage: {
    getById: (id: string) => Promise<StorageResult<T>>;
    put: (data: T) => Promise<any>;
    delete: (id: string) => Promise<any>;
    exists: (id: string) => Promise<{ data: boolean }>;
  };
  createForm: (
    data: Partial<T>,
    editing: boolean,
    origin?: ButtonPlacement
  ) => void;
}
