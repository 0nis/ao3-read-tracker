import { CLASS_PREFIX } from "../../../../constants/classes";
import { toKebabCase } from "../../../../utils/string";
import { showNotification } from "../../../../utils/ui/dialogs";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { makeExpandable } from "../../../../utils/ui/elements/expandable/element";
import { ExpandableItemParams, getExpandedImportButtons } from "./config";
import { getStyles } from "./style";

const IMPORT_CLASS = `${CLASS_PREFIX}__import`;

export function buildImportButton() {
  injectStyles(`${CLASS_PREFIX}__styles--import`, getStyles(CLASS_PREFIX));

  const btnConfigs = getExpandedImportButtons();
  const items = btnConfigs.map((cfg) =>
    createImportExpandableSecondaryItem(cfg)
  );

  const importBtn = createImportExpandableButton();
  const importSecondary = createImportExpandableSecondary(items);

  const li = el(
    "li",
    {
      className: `${IMPORT_CLASS}`,
      attrs: {
        "aria-label": "Import your data for this extension from a file",
      },
    },
    [importBtn, importSecondary]
  );

  makeExpandable({ trigger: importBtn, panel: importSecondary, parent: li });

  return li;
}

function createImportExpandableButton(): HTMLElement {
  return el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--danger collapsed`,
    },
    ["Import"]
  );
}

function createImportExpandableSecondary(
  items: HTMLElement[] = []
): HTMLElement {
  return el(
    "ul",
    {
      className: `${IMPORT_CLASS}__expandable-secondary expandable secondary hidden`,
    },
    [...items]
  );
}

function createImportExpandableSecondaryItem({
  label,
  description,
  className,
  onClick,
  onConfirm,
}: ExpandableItemParams): HTMLElement {
  const btn = el(
    "button",
    {
      className: `button ${className ?? ""}`.trim(),
      type: "button",
      title: description,
      attrs: {
        "aria-label": `${label}. Click to select a file to import.`,
      },
    },
    [label]
  );
  const input = el("input", {
    id: `${IMPORT_CLASS}__file-input--${toKebabCase(label)}`,
    type: "file",
    accept: ".json",
    multiple: false,
    className: `${CLASS_PREFIX}__hidden`,
    tabIndex: -1,
    attrs: { "aria-hidden": "true" },
  });
  if (onClick) {
    btn.addEventListener("click", () => {
      const confirmed = onConfirm?.();
      if (!confirmed) showNotification("Data import action cancelled.");
      else input.click();
    });
    input.addEventListener("change", async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      await onClick(btn, file);
      target.value = "";
    });
  }
  return el("li", {}, [btn, input]);
}
