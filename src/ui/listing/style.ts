export function addListingStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .ao3-mark-as-read__indicator {
      float: right;
    }
    .ao3-mark-as-read__collapsed .ao3-mark-as-read__indicator {
      float: left;
    }
    .ao3-mark-as-read__collapsed .ao3-mark-as-read__toggle {
      float: right;
      margin: 4px 0px;
    }
    .hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
