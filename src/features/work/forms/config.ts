import { StorageService } from "../../../services/storage";
import { StorageResult } from "../../../types/results";
import { WorkAction, WorkActionTypeMap } from "../config";

export interface SaveMapEntry<T> {
  putter: (data: T) => Promise<StorageResult<void>>;
  deleter: (id: string) => Promise<StorageResult<void>>;
}

export const FORMS_SAVE_MAP: {
  [K in keyof WorkActionTypeMap]: SaveMapEntry<WorkActionTypeMap[K]>;
} = {
  [WorkAction.FINISHED]: {
    putter: StorageService.finishedWorks.put,
    deleter: StorageService.finishedWorks.delete,
  },
  [WorkAction.IN_PROGRESS]: {
    putter: StorageService.inProgressWorks.put,
    deleter: StorageService.inProgressWorks.delete,
  },
  [WorkAction.IGNORE]: {
    putter: StorageService.ignoredWorks.put,
    deleter: StorageService.ignoredWorks.delete,
  },
};
