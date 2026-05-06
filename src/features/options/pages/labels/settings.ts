import { createSettingsSection } from "../../core/setting/base";
import { SettingsSectionItem } from "../../core/setting/types";
import { SectionId } from "../../config";

import { settingsCache } from "../../../../services/cache";
import { text } from "../../../../ui/forms";
import { FormItemType } from "../../../../ui/forms/enums";
import { LabelSettings } from "../../../../types/settings";

const items: SettingsSectionItem<LabelSettings>[] = [
  {
    type: FormItemType.GROUP,
    id: "finishedLabels",
    sectionId: SectionId.LABEL_SETTINGS,
    label: "Button Labels for Module 'Finished'",
    collapsible: true,
    collapsedByDefault: true,
    description: "Click to expand/collapse.",
    fields: [
      {
        id: "finishedSimple",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Simple Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add Finished State",
            input: text({}),
            dataField: "actions.finished.simple.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Remove Finished State",
            input: text({}),
            dataField: "actions.finished.simple.on",
          },
        ],
      },
      {
        id: "finishedAdvanced",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Advanced Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add Finished State",
            input: text({}),
            dataField: "actions.finished.advanced.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Edit Finished State",
            input: text({}),
            dataField: "actions.finished.advanced.on",
          },
        ],
      },
    ],
  },
  {
    type: FormItemType.GROUP,
    id: "inProgressLabels",
    sectionId: SectionId.LABEL_SETTINGS,
    label: "Button Labels for Module 'In Progress'",
    collapsible: true,
    collapsedByDefault: true,
    description: "Click to expand/collapse.",
    fields: [
      {
        id: "inProgressSimple",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Simple Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add In Progress State",
            input: text({}),
            dataField: "actions.in_progress.simple.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Remove In Progress State",
            input: text({}),
            dataField: "actions.in_progress.simple.on",
          },
        ],
      },
      {
        id: "inProgressAdvanced",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Advanced Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add In Progress State",
            input: text({}),
            dataField: "actions.in_progress.advanced.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Edit In Progress State",
            input: text({}),
            dataField: "actions.in_progress.advanced.on",
          },
        ],
      },
      {
        id: "inProgressMisc",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Miscellaneous",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Update Read Progress",
            input: text({}),
            dataField: "misc.updateReadProgress",
          },
        ],
      },
    ],
  },
  {
    type: FormItemType.GROUP,
    id: "ignoreLabels",
    sectionId: SectionId.LABEL_SETTINGS,
    label: "Button Labels for Module 'Ignored'",
    collapsible: true,
    collapsedByDefault: true,
    description: "Click to expand/collapse.",
    fields: [
      {
        id: "ignoredSimple",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Simple Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add Ignored State",
            input: text({}),
            dataField: "actions.ignored.simple.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Remove Ignored State",
            input: text({}),
            dataField: "actions.ignored.simple.on",
          },
        ],
      },
      {
        id: "ignoredAdvanced",
        type: FormItemType.GROUP,
        sectionId: SectionId.LABEL_SETTINGS,
        label: "Advanced Mode",
        fields: [
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Add Ignored State",
            input: text({}),
            dataField: "actions.ignored.advanced.off",
          },
          {
            type: FormItemType.FIELD,
            sectionId: SectionId.LABEL_SETTINGS,
            label: "Edit Ignored State",
            input: text({}),
            dataField: "actions.ignored.advanced.on",
          },
        ],
      },
    ],
  },
  {
    type: FormItemType.FIELD,
    sectionId: SectionId.LABEL_SETTINGS,
    label: "Native 'Mark as Read' Button Label",
    input: text({ placeholder: "e.g., Finished" }),
    dataField: "misc.nativeMarkAsReadReplacement",
    description:
      "Changes the text shown on AO3's built-in <span style='font-style: italic;'>Mark as Read</span> button on the work page. This affects AO3's own button -- the one that appears after clicking <span style='font-style: italic;'>Mark for Later</span>. Leave blank to use AO3's default text.",
  },
];

export async function buildLabelSettingsSection(): Promise<HTMLElement> {
  const { labelSettings } = await settingsCache.get();
  return createSettingsSection({
    id: SectionId.LABEL_SETTINGS,
    title: "Label Settings",
    data: labelSettings,
    items,
  });
}
