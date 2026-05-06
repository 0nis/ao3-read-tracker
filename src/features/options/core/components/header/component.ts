import { getStyles } from "./style";
import { buildClearDataButton } from "../../../pages/io/clear/component";
import { buildExportButton } from "../../../pages/io/export/component";
import { buildImportButton } from "../../../pages/io/import/component";

import { el, injectStyles } from "../../../../../utils/dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

const getClass = () => `${CLASS_PREFIX}__header`;

export function buildHeader(extensionName: string) {
  injectStyles(
    `${CLASS_PREFIX}__styles--options-header`,
    getStyles(getClass()),
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
    ],
  );
}
