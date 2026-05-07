import { ExtensionModule } from "./settings";

export enum WorkState {
  FINISHED = "finished",
  IN_PROGRESS = "in_progress",
  IGNORED = "ignored",
}

export enum ReadingStatus {
  ACTIVE = "active",
  WAITING = "waiting",
  PAUSED = "paused",
}

export enum FinishedStatus {
  COMPLETED = "completed",
  DROPPED = "dropped",
  DORMANT = "dormant",
}

export const WORK_STATE_MODULE_MAP: {
  [K in WorkState]: ExtensionModule;
} = {
  [WorkState.FINISHED]: ExtensionModule.FINISHED,
  [WorkState.IN_PROGRESS]: ExtensionModule.IN_PROGRESS,
  [WorkState.IGNORED]: ExtensionModule.IGNORED,
};
