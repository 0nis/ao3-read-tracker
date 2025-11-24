import { SymbolId, SymbolType } from "../../enums/symbols";
import { PREFIX } from "../../features/options";
import { symbolsCache } from "../../services/cache/symbols";

/**
 * Helper to create new elements quickly
 *
 * @param tag The HTML tag name to create
 * @param props Optional DOM properties, attributes, or HTML injection
 * @param children Optional child elements or text to append
 * @returns The created HTMLElement
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Omit<Partial<HTMLElementTagNameMap[K]>, "style"> & {
    attrs?: Record<string, string>;
    html?: string;
    style?: Partial<CSSStyleDeclaration>;
  },
  children?: HTMLElement | string | Array<HTMLElement | string>
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props) {
    const { attrs, html, style, ...domProps } = props;
    Object.assign(node, domProps);
    if (style) {
      for (const [k, v] of Object.entries(style)) {
        if (v === undefined) continue;
        (node.style as any)[k] = v;
      }
    }
    if (attrs) {
      for (const [key, value] of Object.entries(attrs))
        node.setAttribute(key, value);
    }
    if (html !== undefined) node.innerHTML = html;
  }
  if (children !== undefined) {
    const list = Array.isArray(children) ? children : [children];
    for (const c of list) {
      if (c == null) continue;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    }
  }
  return node;
}

/**
 * Ensures that the parent contains exactly one child matching a given selector.
 * - If an element already exists, it is returned.
 * - If none exists, a new one is created using `el()` and appended.
 *
 * @template K The HTML tag name to create if no existing element is found.
 * @param parent The parent element in which the element should exist.
 * @param className The class name to find an existing element (e.g., "class-name")
 * @param tag The tag name to use when creating a new element.
 * @param createProps Optional properties to apply **only when creating** a new element.
 * @returns The existing or newly created child element.
 */
export function ensureChild<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  className: string,
  tag: K,
  createProps?: Parameters<typeof el>[1]
): HTMLElementTagNameMap[K] {
  const existing = parent.querySelector<HTMLElementTagNameMap[K]>(
    `.${className}`
  );
  if (existing) return existing;

  const node = el(tag, { className, ...createProps } as any);
  parent.appendChild(node);
  return node;
}

/**
 * Injects CSS styles into the document head.
 * If a style element with the given ID already exists, does nothing (idempotent).
 *
 * @param id Unique ID for the style element (used to prevent duplicates)
 * @param css The CSS string to inject
 */
export function injectStyles(id: string, css: string): void {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Gets an element by selector within a parent element.
 */
export const getElement = (
  parent: HTMLElement,
  selector: string
): HTMLElement | null => parent.querySelector(selector);

/**
 * Gets a symbol element (image or text) by its ID.
 */
export async function getSymbolElement(
  id: SymbolId,
  fallback: string = "❔"
): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const symbol = symbols[id];
  if (!symbol) return el("span", { textContent: fallback });

  if (symbol.type === SymbolType.IMAGE && symbol.imgUrl) {
    return el("img", {
      src: symbol.imgUrl,
      alt: symbol.label,
    });
  }
  return el("span", { textContent: symbol.text || fallback });
}
