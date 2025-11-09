export function addListingStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .ext-mar__indicator {
      float: right;
    }
    .ext-mar__collapsed .ext-mar__indicator {
      float: left;
    }
    .ext-mar__collapsed .ext-mar__toggle {
      float: right;
      margin: 4px 0px;
    }
    .ext-mar__hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
