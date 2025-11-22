import { PREFIX } from "../..";
import { ButtonPlacement } from "../../../../constants/enums";
import { el } from "../../../../utils/dom";
import { buildSelectFromEnum } from "../../../../utils/form";
import { createSection } from "./base";

export function buildGeneralSection(): HTMLElement {
  const hideSymbolsField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Hide symbols"]),
    el("input", { type: "checkbox", attrs: { "data-field": "hideSymbols" } }),
  ]);

  const buttonPlacementField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Button placement"]),
    buildSelectFromEnum(ButtonPlacement, undefined, {
      "data-field": "buttonPlacement",
    }),
  ]);

  const replaceMarkForLaterField = el(
    "div",
    { className: `${PREFIX}__field` },
    [
      el("label", {}, ['Replace AO3\'s default "Mark as Read" button text']),
      el("input", {
        type: "checkbox",
        attrs: { "data-field": "replaceMarkForLaterText" },
      }),
    ]
  );

  const replacementLabelField = el("div", { className: `${PREFIX}__field` }, [
    el("label", {}, ["Custom label for 'Mark as Read' button"]),
    el("input", {
      type: "text",
      placeholder: "e.g., Finished",
      attrs: { "data-field": "markForLaterReplacementLabel" },
    }),
  ]);

  return createSection({
    id: "general",
    title: "General Settings",
    fields: [
      hideSymbolsField,
      buttonPlacementField,
      replaceMarkForLaterField,
      replacementLabelField,
    ],
  });
}
