import { getListClass } from "../../components/list";
import { UserOption } from "../../types";

import { el } from "../../../../../../utils/dom";
import { makeExpandable } from "../../../../../../ui/behaviors/expandable";
import { getInputValue, getInputElement } from "../../../../../../ui/forms";
import { CLASS_PREFIX } from "../../../../../../constants/classes";
import { toKebabCase } from "../../../../../../utils/string";

function getOptionsClass() {
  return `${getListClass()}__options`;
}

interface OptionButtonConfig {
  userOptions: Record<string, UserOption<any>>;
  allowedOrderBy: string[];
}

export function buildOptionButton(cfg: OptionButtonConfig): HTMLElement {
  const trigger = createTrigger();
  const panel = createPanel(cfg);

  const wrapper = el("div", { className: getOptionsClass() }, [trigger, panel]);

  makeExpandable({
    trigger: trigger,
    panel: panel,
    parent: wrapper,
    alignment: "right",
  });

  return wrapper;
}

function createTrigger(): HTMLButtonElement {
  return el(
    "button",
    {
      className: `${CLASS_PREFIX}__button ${getOptionsClass()}-trigger collapsed`,
    },
    ["Options"],
  );
}

function createPanel(cfg: OptionButtonConfig): HTMLElement {
  const ul = el("ul", {
    className: `${getOptionsClass()}-panel expandable secondary`,
  });

  for (const [key, value] of Object.entries(cfg.userOptions)) {
    if (value.show === false) continue;
    const input = getInputElement(value.input);
    if (!input) continue;
    input.id = `${getOptionsClass()}--${toKebabCase(key)}`;
    const li = el("li", { className: `${getOptionsClass()}-item` }, [
      el(
        "label",
        {
          className: `${getOptionsClass()}-label`,
          attrs: {
            for: input.id,
          },
        },
        [value.label],
      ),
      value.input,
    ]);
    ul.appendChild(li);
    input.addEventListener("input", () => {
      value.onChange?.(getInputValue(input));
    });
  }

  return ul;
}
