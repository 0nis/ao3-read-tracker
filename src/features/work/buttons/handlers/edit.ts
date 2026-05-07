import { ACTION_HANDLER_MAP } from "../config";
import { getBtnOrigin } from "../helpers/placement";

import { WorkActionTypeMap } from "../../config";
import { getTitleFromWorkPage } from "../../helpers";
import { FormRegistry } from "../../forms/registry";

export async function handleEditWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement,
) {
  if (FormRegistry.get(workAction)) {
    FormRegistry.navigate(workAction);
    return;
  }
  const cfg = ACTION_HANDLER_MAP[workAction];
  const { data } = await cfg.storage.getById(id);

  await cfg.createForm(
    {
      ...(data || {}),
      id,
      title: getTitleFromWorkPage() || "Untitled",
    } as Partial<WorkActionTypeMap[K]>,
    !!data,
    getBtnOrigin(btn),
  );
}
