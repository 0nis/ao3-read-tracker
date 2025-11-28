import { PREFIX } from "../..";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { toLowerCaseAndReplaceSpaces } from "../../../../utils/string";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { getExpandedImportButtons } from "./config";
import { getStyles } from "./style";

export function buildImportButton() {
  injectStyles(`${PREFIX}__options__import--styles`, getStyles(PREFIX));

  const btnConfigs = getExpandedImportButtons(PREFIX);
  const items = btnConfigs.map((cfg) =>
    createImportExpandableSecondaryItem(
      cfg.label,
      cfg.description,
      cfg.className,
      cfg.onClick
    )
  );

  const importBtn = createImportExpandableButton();
  const importSecondary = createImportExpandableSecondary(items);
  addExpandableBehavior(importBtn, importSecondary);

  return el(
    "li",
    {
      className: `${PREFIX}__import`,
      attrs: {
        "aria-label": "Import your data for this extension from a file",
        "aria-expanded": "false",
      },
    },
    [importBtn, importSecondary]
  );
}

function addExpandableBehavior(btn: HTMLElement, secondary: HTMLElement) {
  btn.addEventListener("click", () => {
    const isHidden = secondary.classList.contains("hidden");
    if (isHidden) {
      secondary.classList.remove("hidden");
      btn.classList.remove("collapsed");
      btn.classList.add("expanded");
      btn.setAttribute("aria-expanded", "true");
    } else {
      secondary.classList.add("hidden");
      btn.classList.remove("expanded");
      btn.classList.add("collapsed");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

function createImportExpandableButton(): HTMLElement {
  return el("button", { className: `${PREFIX}__button collapsed` }, ["Import"]);
}

function createImportExpandableSecondary(
  items: HTMLElement[] = []
): HTMLElement {
  return el(
    "ul",
    {
      className: `${PREFIX}__import__expandable-secondary expandable secondary hidden`,
    },
    [...items]
  );
}

function createImportExpandableSecondaryItem(
  label: string,
  description: string,
  className?: string,
  onClick?: (e: Event, file: Blob) => Promise<void>
): HTMLElement {
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
    id: `${PREFIX}__import__file-input--${toLowerCaseAndReplaceSpaces(label)}`,
    type: "file",
    accept: ".json",
    multiple: false,
    className: `${CLASS_PREFIX}__hidden`,
    tabIndex: -1,
    attrs: { "aria-hidden": "true" },
  });
  if (onClick) {
    btn.addEventListener("click", () => input.click());
    input.addEventListener("change", async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      await onClick(e, file);
      target.value = "";
    });
  }
  return el("li", {}, [btn, input]);
}
