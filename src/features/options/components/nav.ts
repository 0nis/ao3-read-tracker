import { PREFIX } from "..";
import { el } from "@utils/ui";

export function buildNav(items: { id: string; label: string }[]): {
  nav: HTMLElement;
  updateSelected: (id: string) => void;
} {
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
      window.location.hash = it.id;
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

  function updateSelected(id: string) {
    ul.querySelectorAll("a").forEach((link) => {
      const linkHash = link.getAttribute("href")?.slice(1);
      link.classList.toggle("selected", linkHash === id);
    });
  }

  return { nav, updateSelected };
}
