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
  [WorkAction.READ]: {
    putter: StorageService.readWorks.put,
    deleter: StorageService.readWorks.delete,
  },
  [WorkAction.IGNORE]: {
    putter: StorageService.ignoredWorks.put,
    deleter: StorageService.ignoredWorks.delete,
  },
};
