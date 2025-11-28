import { PREFIX } from "..";
import { el } from "../../../utils/ui/dom";
import { buildClearDataButton } from "../io/clear/component";
import { buildExportButton } from "../io/export/component";
import { buildImportButton } from "../io/import/component";

export function buildHeader(extensionName: string) {
  return el(
    "header",
    { className: `${PREFIX}__header`, attrs: { role: "banner" } },
    [
      el("h2", { className: `${PREFIX}__header__title` }, [
        `${extensionName} Extension Options`,
      ]),
      el("ul", { className: `actions ${PREFIX}__header__actions` }, [
        buildExportButton(),
        buildImportButton(),
        buildClearDataButton(),
      ]),
    ]
  );
}
