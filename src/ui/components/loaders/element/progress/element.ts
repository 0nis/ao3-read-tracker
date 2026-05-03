import { CLASS_PREFIX } from "../../../../../constants/classes";
import { el, injectStyles } from "../../../../../utils/dom";
import { getStyles } from "./style";

const className = `${CLASS_PREFIX}__progress-loader`;

export function createProgressLoader() {
  injectStyles(`${className}--styles`, getStyles(className));

  const container = el("span", {
    className: className,
    attrs: { role: "status", "aria-label": "Loading" },
  });

  const bar = el("span", {
    className: `${className}__bar`,
  });

  container.appendChild(bar);

  return {
    element: container,
    setProgress: (value: number) => {
      bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
    },
  };
}
