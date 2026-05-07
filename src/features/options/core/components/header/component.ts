import { getStyles } from "./style";
import { buildClearDataButton } from "../../../pages/io/clear/component";
import { buildExportButton } from "../../../pages/io/export/component";
import { buildImportButton } from "../../../pages/io/import/component";

import { el, injectStyles } from "../../../../../utils/dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

const getClass = () => `${CLASS_PREFIX}__header`;

export function buildHeader({
  extensionName,
  warnings,
}: {
  extensionName: string;
  warnings?: string[];
}): { header: HTMLElement; headerContainer: HTMLElement } {
  injectStyles(
    `${CLASS_PREFIX}__styles--options-header`,
    getStyles(getClass()),
  );

  const headerContainer = el("div", { className: `${getClass()}-container` }, [
    el("h2", { className: `${getClass()}-title` }, [
      `${extensionName} Extension Options`,
    ]),
    el("ul", { className: `actions ${getClass()}-actions` }, [
      buildExportButton(),
      buildImportButton(),
      buildClearDataButton(),
    ]),
  ]);

  const header = el(
    "header",
    { className: `${getClass()}`, attrs: { role: "banner" } },
    [
      headerContainer,
      ...(warnings || []).map((warning) =>
        el("p", { className: `${getClass()}-warning`, innerHTML: warning }),
      ),
    ],
  );

  return { header, headerContainer };
}
