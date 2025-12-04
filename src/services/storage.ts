import {
  createSafeService,
  safeExecute,
  SafeServiceFor,
} from "../utils/storage/safe";
import type { WorkData } from "../types/works";
import type { StorageResult } from "../types/results";
import { instances, type InstanceMap } from "../data/instances";

type SafeServices = {
  [K in keyof InstanceMap]: SafeServiceFor<InstanceMap[K]>;
};

function typedEntries<T extends object>(
  obj: T
): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(obj) as any;
}

type StorageServiceResult = SafeServices & {
  getByIds(ids: string[]): Promise<StorageResult<WorkData>>;
};

function buildStorageService<M extends InstanceMap>(
  map: M
): StorageServiceResult {
  const result = {} as StorageServiceResult;

  for (const [key, value] of typedEntries(map)) {
    (result as any)[key] = createSafeService(
      `StorageService.${String(key)}`,
      value
    );
  }

  result.getByIds = async (ids: string[]): Promise<StorageResult<WorkData>> =>
    safeExecute(
      async () => ({
        readWorks: await map.readWorks.getByIds(ids),
        inProgressWorks: await map.inProgressWorks.getByIds(ids),
        ignoredWorks: await map.ignoredWorks.getByIds(ids),
      }),
      "StorageService.getByIds"
    );

  return result;
}

export const StorageService = buildStorageService(instances);
