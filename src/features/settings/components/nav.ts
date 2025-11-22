import { PREFIX } from "..";
import { el } from "../../../utils/dom";

export function buildNav(
  items: { id: string; label: string }[],
  onClick: (id: string) => void
) {
  const nav = el("aside", {
    className: `${PREFIX}__nav`,
    attrs: { role: "navigation", "aria-label": "Settings navigation" },
  });
  const ul = el("ul");
  items.forEach((it) => {
    const li = el("li");
    const a = el("a", { href: `#${it.id}` }, [it.label]);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      onClick(it.id);
      ul.querySelectorAll("a").forEach((link) => {
        link.classList.remove("selected");
      });
      a.classList.add("selected");
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  ul.querySelector("a")?.classList.add("selected");
  nav.appendChild(ul);
  return nav;
}
