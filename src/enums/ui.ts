import { CLASS_PREFIX } from "../constants/classes";

export enum CollapseMode {
  GENTLE = "gentle",
  AGGRESSIVE = "aggressive",
}

export enum LoaderType {
  SPINNER = "spinner",
  PROGRESS = "progress",
}

export enum CustomInputType {
  TOGGLE_SWITCH = `${CLASS_PREFIX}-toggle-switch`,
}

export enum SortDirection {
  ASC = "ascending",
  DESC = "descending",
}

export enum BooleanFilterSelect {
  ALL = "all",
  TRUE = "yes",
  FALSE = "no",
}
