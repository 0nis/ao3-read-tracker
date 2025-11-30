import { WorkAction, WorkActionTypeMap } from "../config";
import { ButtonPlacement } from "../../../enums/settings";

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
  onActivate: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

export interface ClickButtonConfig extends BaseButtonConfig {
  mode: ButtonAction.CLICK;
  href: string;
  onClick: (id: string) => Promise<void>;
}

export type ButtonConfig = ToggleButtonConfig | ClickButtonConfig;

export interface ActionButtonMeta {
  simple: Partial<ToggleButtonConfig>;
  advanced: Partial<ClickButtonConfig>;
}

export interface ActionHandlerEntry<T> {
  storage: {
    getById: (id: string) => Promise<{ data: T | undefined }>;
    put: (data: T) => Promise<any>;
    delete: (id: string) => Promise<any>;
    exists: (id: string) => Promise<{ data: boolean }>;
  };
  createForm: (data: Partial<T>, editing: boolean) => void;
}
