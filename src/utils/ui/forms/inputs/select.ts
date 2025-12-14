import { CLASS_PREFIX } from "../../../../constants/classes";
import { toSentenceCase } from "../../../string";
import { el } from "../../dom";

export type SelectOptions = {
  options: string[];
  defaultOption?: string;
  attrs?: Record<string, string>;
  id?: string;
};

/** Builds a HTML select element from an array of options */
export function select({
  options,
  defaultOption,
  attrs,
  id,
}: SelectOptions): HTMLSelectElement {
  const element = el(
    "select",
    {
      id,
      className: `${CLASS_PREFIX}__select`,
      attrs: {
        ...attrs,
        "default-value": defaultOption ? String(defaultOption) : "",
      },
    },
    options.map((v) => {
      return el("option", {
        value: String(v),
        textContent: toSentenceCase(String(v)),
      });
    })
  );
  element.value = defaultOption ? String(defaultOption) : String(options[0]);
  return element;
}
