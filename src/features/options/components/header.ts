import { PREFIX } from "..";
import { el } from "../../../utils/ui/dom";
import { buildExportButton } from "./export/export";
import { buildImportButton } from "./import/import";

export function buildHeader(extensionName: string) {
  const exportBtn = buildExportButton();

  // const importTxt = "Overwrite your current data with an exported file";
  // const importBtn = el(
  //   "button",
  //   {
  //     className: `button ${PREFIX}__button ${PREFIX}__button--danger`,
  //     type: "button",
  //     title: importTxt,
  //     attrs: { "aria-label": importTxt },
  //   },
  //   ["Import"]
  // );
  const importBtn = buildImportButton();

  const clearTxt = "Clear all data stored by this extension";
  const clearBtn = el(
    "button",
    {
      className: `button ${PREFIX}__button ${PREFIX}__button--danger`,
      type: "button",
      title: clearTxt,
      attrs: { "aria-label": clearTxt },
    },
    ["Clear All Data"]
  );

  const header = el(
    "header",
    { className: `${PREFIX}__header`, attrs: { role: "banner" } },
    [
      el("h2", { className: `${PREFIX}__header__title` }, [
        `${extensionName} Extension Options`,
      ]),
      el("ul", { className: `actions ${PREFIX}__header__actions` }, [
        exportBtn,
        importBtn,
        clearBtn,
      ]),
    ]
  );

  return { header, exportBtn, importBtn, clearBtn };
}
