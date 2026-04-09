import { ACTION_DEFAULTS_MAP, WorkActionTypeMap } from "./config";

import { getIdFromUrl, getTitleFromWorkPage } from "../../utils/ao3";
import { warn } from "../../shared/extension/logger";
import { VerticalPlacement } from "../../enums/settings";

export const getWorkTitleForNotifications = (
  title: string | undefined,
): string => {
  return String(title) || "this work";
};

export const getDefaultPayload = <K extends keyof WorkActionTypeMap>(
  action: K,
  data: Partial<WorkActionTypeMap[K]>,
): WorkActionTypeMap[K] => {
  const id = data.id || getIdFromUrl();
  const title = getTitleFromWorkPage() ?? undefined;
  if (!id) throw new Error("No id found for work");

  const defaults = ACTION_DEFAULTS_MAP[action](data);
  return {
    ...defaults,
    ...data,
    id,
    title: title || data.title || "Untitled",
  } as WorkActionTypeMap[K];
};

export function placeNotice(
  main: HTMLElement,
  notice: HTMLElement,
  placement: VerticalPlacement,
) {
  if (placement === VerticalPlacement.BOTTOM) {
    const el = main.querySelector("#feedback")?.querySelector("ul.actions");
    if (el) {
      el.after(notice);
      return;
    }

    warn(
      "Could not find #feedback.ul.actions to insert flash notice after. Prepending to main instead.",
    );
  }

  main.prepend(notice);
}
