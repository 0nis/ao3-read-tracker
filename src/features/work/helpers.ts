import { getIdFromUrl, getTitleFromWorkPage } from "../../utils/ao3";
import { WorkActionTypeMap } from "./config";

export const getWorkTitleForNotifications = (
  title: string | undefined
): string => {
  return String(title) || "this work";
};

export const getDefaultPayload = <K extends keyof WorkActionTypeMap>(
  data: Partial<WorkActionTypeMap[K]>
): WorkActionTypeMap[K] => {
  const id = data.id || getIdFromUrl();
  const title = getTitleFromWorkPage() ?? undefined;
  if (!id) throw new Error("No id found for work");
  return {
    ...data,
    id,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    title: title || data.title || "Untitled",
  };
};
