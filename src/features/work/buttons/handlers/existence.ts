import { ACTION_HANDLER_MAP } from "../config";
import { WorkActionTypeMap } from "../../config";

export async function handleCheckExistence<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const exists = (await cfg.storage.exists(id)).data;
  return exists;
}
