import { CLASS_PREFIX } from "../../constants/classes";
import { SettingsType } from "../../constants/enums";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { IgnoredFic, ReadFic, SettingsData } from "../../types/storage";
import { getTitleFromWorkPage } from "../../utils/ao3";
import { showNotification } from "../../utils/dom";
import { Router } from "../router";
import { showIgnoredFicForm } from "./form/ignoredForm";
import { showReadFicForm } from "./form/readForm";

export async function handleEditReadFicInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__read-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.readFics.getById(id);
  showReadFicForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleMarkFicAsRead(
  data: Partial<ReadFic>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.readFics.put({
    ...data,
    id: data.id!,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${data.id} marked as read.`);
  else
    showNotification(`Failed to mark fic ${data.id} as read: ${result.error}`);
}

export async function handleMarkFicAsUnread(id: string): Promise<void> {
  const result = await StorageService.readFics.delete(id);
  if (result.success) showNotification(`Fic ${id} marked as unread.`);
  else showNotification(`Failed to mark fic ${id} as unread: ${result.error}`);
}

export async function handleEditIgnoredFicInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__ignored-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.ignoredFics.getById(id);
  showIgnoredFicForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleIgnoreFic(
  data: Partial<IgnoredFic>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.ignoredFics.put({
    ...data,
    id: data.id!,
    timestamp: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${data.id} is now being ignored.`);
  else showNotification(`Failed to ignore fic ${data.id}: ${result.error}`);
}

export async function handleUnignoreFic(id: string): Promise<void> {
  const result = await StorageService.ignoredFics.delete(id);
  if (result.success) showNotification(`Fic ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${id}: ${result.error}`);
}

export async function handleGetSettings(): Promise<SettingsData> {
  const { data } = await StorageService.getAllSettings();
  const { readSettings, ignoreSettings, generalSettings } = data || {};
  return {
    readSettings: readSettings || DEFAULT_READ_SETTINGS,
    ignoreSettings: ignoreSettings || DEFAULT_IGNORE_SETTINGS,
    generalSettings: generalSettings || DEFAULT_GENERAL_SETTINGS,
  };
}
