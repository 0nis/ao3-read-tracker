import { getStyles } from "./style";
import { buildClearDataButton } from "../../advanced/io/clear/component";
import { buildExportButton } from "../../advanced/io/export/component";
import { buildImportButton } from "../../advanced/io/import/component";

import { el, injectStyles } from "../../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../../constants/classes";

const getClass = () => `${CLASS_PREFIX}__header`;

export function buildHeader(extensionName: string) {
  injectStyles(
    `${CLASS_PREFIX}__styles--options-header`,
    getStyles(getClass())
  );
  return el(
    "header",
    { className: `${getClass()}`, attrs: { role: "banner" } },
    [
      el("h2", { className: `${getClass()}-title` }, [
        `${extensionName} Extension Options`,
      ]),
      el("ul", { className: `actions ${getClass()}-actions` }, [
        buildExportButton(),
        buildImportButton(),
        buildClearDataButton(),
      ]),
    ]
  );
}
