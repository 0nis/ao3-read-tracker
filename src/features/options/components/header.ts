import { CLASS_PREFIX } from "../../../constants/classes";
import { el } from "../../../utils/ui/dom";
import { buildClearDataButton } from "../io/clear/component";
import { buildExportButton } from "../io/export/component";
import { buildImportButton } from "../io/import/component";

export function buildHeader(extensionName: string) {
  return el(
    "header",
    { className: `${CLASS_PREFIX}__header`, attrs: { role: "banner" } },
    [
      el("h2", { className: `${CLASS_PREFIX}__header-title` }, [
        `${extensionName} Extension Options`,
      ]),
      el("ul", { className: `actions ${CLASS_PREFIX}__header-actions` }, [
        buildExportButton(),
        buildImportButton(),
        buildClearDataButton(),
      ]),
    ]
  );
}
