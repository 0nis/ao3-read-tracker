import { CLASS_PREFIX } from "../../../../constants/classes";
import { el, injectStyles } from "../../../../utils/dom";
import { createSectionWrapper } from "../../core/components/section/component";
import { SectionId } from "../../config";
import { buildClearDataButton } from "./clear/component";
import { buildExportButton } from "./export/component";
import { buildImportButton } from "./import/component";
import { getStyles } from "./style";

const DATA_CLASS = `${CLASS_PREFIX}__data`;

export function buildDataSection() {
  injectStyles(`${CLASS_PREFIX}__styles--data`, getStyles(DATA_CLASS));

  const section = createSectionWrapper({
    id: SectionId.DATA,
    title: "Data & Storage",
  });

  section.append(
    createCategory({
      title: "Storage",
      description: `
        Here you can manage your extension's stored data. The available actions are:
        <ul>
            <li><strong>Export:</strong> Creates a JSON backup of your current data.</li>
            <li><strong>Import:</strong> Loads data from a previously exported JSON file. There are three modes:
                <ol>
                    <li>Import Only New Data - Adds entries that do not already exist.</li>
                    <li>Merge & Overwrite Duplicates - Adds new entries and overwrites duplicates.</li>
                    <li>Overwrite Data - Completely replaces current data.</li>
                </ol>
            </li>
            <li><strong>Clear Data:</strong> Deletes all stored data permanently.</li>
        </ul>
    `,
      children: [
        el("p", {
          className: `${DATA_CLASS}__category-warning`,
          innerHTML: `<strong>Warning:</strong> Clearing or overwriting data cannot be undone. Make sure to export your data first if you want a backup.`,
        }),
        el("ul", { className: `actions ${DATA_CLASS}__category-actions` }, [
          buildExportButton(),
          buildImportButton(),
          buildClearDataButton(),
        ]),
      ],
    }),
  );

  section.append(
    createCategory({
      title: "How Data Is Stored",
      description: `
        <p>All your data stays entirely on your device; nothing is sent to AO3 or any other server. The extension stores information locally using your browser, keeping it entirely private.</p>
        <p>This means you are in full control: only you can access, edit, or delete your data. If you remove the extension or switch devices, your data won't follow. It lives solely on the device where it was created.</p>
        <p>To move your data to another device, you'll need to use the export and import functionalities.</p>
    `,
    }),
  );

  return section;
}

function createCategory({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: HTMLElement[] | HTMLElement;
}) {
  return el("li", { className: `${DATA_CLASS}__category` }, [
    el("h4", { className: `${DATA_CLASS}__category-title` }, [title]),
    ...(description
      ? [
          el("p", {
            className: `${DATA_CLASS}__category-description`,
            innerHTML: description,
          }),
        ]
      : []),
    ...(children
      ? [el("ul", { className: `${DATA_CLASS}__category-items` }, children)]
      : []),
  ]);
}
