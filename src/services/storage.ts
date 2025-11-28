import { createSafeService, safeExecute } from "../utils/storage/safe";
import type { WorkData } from "../types/works";
import type { StorageResult } from "../types/results";
import { instances, type InstanceMap } from "../data/instances";

type SafeServices = {
  [K in keyof InstanceMap]: ReturnType<typeof createSafeService>;
};

function buildStorageService(map: InstanceMap): SafeServices & {
  getByIds(ids: string[]): Promise<StorageResult<WorkData>>;
} {
  const result: any = {};

  for (const key of Object.keys(map) as Array<keyof InstanceMap>) {
    result[key] = createSafeService(`StorageService.${key}`, map[key]);
  }

  result.getByIds = async (ids: string[]): Promise<StorageResult<WorkData>> =>
    safeExecute(
      async () => ({
        readWorks: await map.readWorks.getByIds(ids),
        ignoredWorks: await map.ignoredWorks.getByIds(ids),
      }),
      "StorageService.getByIds"
    );

  return result;
}

export const StorageService = buildStorageService(instances);
