import { PREFIX } from "../";
import { el } from "../../../utils/dom";

export function buildNav(
  items: { id: string; label: string }[],
  onClick: (id: string) => void
) {
  const nav = el("aside", { className: `${PREFIX}__nav` });
  const ul = el("ul");
  items.forEach((it) => {
    const li = el("li");
    const a = el("a", { href: `#${it.id}` }, [it.label]);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      onClick(it.id);
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  return nav;
}
