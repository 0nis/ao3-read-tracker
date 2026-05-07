import { createWorkForm } from "../base";
import { WorkFormItem } from "../types";
import { WorkAction } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { textarea } from "../../../../ui/forms";
import { FormItemType } from "../../../../ui/forms/enums";
import { VerticalPlacement } from "../../../../enums/settings";
import { IgnoredWork } from "../../../../types/works";

const items: WorkFormItem<IgnoredWork>[] = [
  {
    type: FormItemType.FIELD,
    dataField: "reason",
    label: "Reason for ignoring",
    description:
      "A private reason that will appear in the work summary block for this work.",
    input: textarea({ rows: 3 }),
  },
];

export async function createIgnoreWorkForm(
  data: Partial<IgnoredWork>,
  editing: boolean,
  origin?: VerticalPlacement,
): Promise<HTMLElement> {
  const { labelSettings } = await settingsCache.get();
  return createWorkForm({
    id: WorkAction.IGNORE,
    landmark: "Ignore Work",
    heading: editing ? "Edit ignore work info" : "Ignore this work",
    data,
    editing,
    items,
    submit: {
      save: {
        label: "Save",
        ariaLabel: `Save and ignore ${data.title || "this work"}`,
      },
      delete: {
        isDeletable: editing === true,
        label: labelSettings.actions.ignored.simple.on,
        ariaLabel: `Remove ${data.title || "this work"} from your ignored list`,
      },
    },
    origin,
  });
}
