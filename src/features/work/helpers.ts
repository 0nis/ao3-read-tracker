import { getIdFromUrl, getTitleFromWorkPage } from "../../utils/ao3";
import { ACTION_DEFAULTS_MAP, WorkActionTypeMap } from "./config";

export const getWorkTitleForNotifications = (
  title: string | undefined
): string => {
  return String(title) || "this work";
};

export const getDefaultPayload = <K extends keyof WorkActionTypeMap>(
  action: K,
  data: Partial<WorkActionTypeMap[K]>
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
