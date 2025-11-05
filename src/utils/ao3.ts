export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  return match ? match[1] : null;
}

export function getTitleFromWorkPage(): string | null {
  const titleElement = document.querySelector("h2.title.heading");
  return titleElement ? titleElement.textContent?.trim() || null : null;
}

export function hijackAo3Page(
  title: string,
  className: string
): HTMLElement | null {
  document.title = title;
  const main = document.getElementById("main");
  if (!main) return null;
  main.innerHTML = "";
  main.className = `ao3-mark-as-read__${className}`;
  return main;
}
