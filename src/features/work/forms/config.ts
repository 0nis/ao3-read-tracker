import { StorageService } from "../../../services/storage";
import { StorageResult } from "../../../types/results";

export enum FormId {
  READ_WORK = `read-form`,
  IGNORE_WORK = `ignore-form`,
}

export const FORMS_SAVE_MAP: Partial<
  Record<
    FormId,
    {
      putter: (v: any) => Promise<StorageResult<void>>;
      deleter: (id: string) => Promise<StorageResult<void>>;
      saveStr: string;
      deleteStr: string;
      errStr: string;
    }
  >
> = {
  [FormId.READ_WORK]: {
    putter: StorageService.readWorks.put,
    deleter: StorageService.readWorks.delete,
    saveStr: "You have successfully marked %title% as read.",
    deleteStr: "You have successfully marked %title% as unread.",
    errStr: "Failed to update read status for %title%.",
  },
  [FormId.IGNORE_WORK]: {
    putter: StorageService.ignoredWorks.put,
    deleter: StorageService.ignoredWorks.delete,
    saveStr: "You have successfully ignored %title%.",
    deleteStr: "%title% will no longer be ignored.",
    errStr: "Failed to update ignore status for %title%.",
  },
};
