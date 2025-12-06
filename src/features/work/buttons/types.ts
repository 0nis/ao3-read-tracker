import type { WorkAction } from "../config";
import type { WorksData } from "../../../data/models/works";
import type { SafeServiceFor } from "../../../utils/storage";
import type { VerticalPlacement } from "../../../enums/settings";

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

export interface ActionHandlerEntry<T extends { id: string }> {
  storage: SafeServiceFor<WorksData<T>>;
  createForm: (
    data: Partial<T>,
    editing: boolean,
    origin?: VerticalPlacement
  ) => void;
}
