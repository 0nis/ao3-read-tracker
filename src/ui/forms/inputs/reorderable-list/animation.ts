export function measurePositions<T>(
  items: T[],
  getEl: (item: T) => HTMLElement | undefined,
): Map<T, DOMRect> {
  const map = new Map<T, DOMRect>();

  items.forEach((item) => {
    const el = getEl(item);
    if (el) map.set(item, el.getBoundingClientRect());
  });

  return map;
}

export function animateFLIP<T>(
  items: T[],
  getEl: (item: T) => HTMLElement | undefined,
  prevRects: Map<T, DOMRect>,
  duration = 200,
) {
  items.forEach((item) => {
    const el = getEl(item);
    const prev = prevRects.get(item);

    if (!el || !prev) return;

    const next = el.getBoundingClientRect();
    const deltaY = prev.top - next.top;

    if (deltaY === 0) return;

    el.style.transform = `translateY(${deltaY}px)`;
    el.style.transition = "transform 0s";

    requestAnimationFrame(() => {
      el.style.transform = "";
      el.style.transition = `transform ${duration}ms ease`;
    });
  });
}
