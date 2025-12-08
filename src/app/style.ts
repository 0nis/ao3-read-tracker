export function getGlobalStyles(prefix: string): string {
  return `
    .${prefix}__hidden {
      display: none !important;
    }

    body.${prefix}__lock-scroll {
      overflow: hidden;
    }

    .${prefix}__sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      margin: -1px !important;
      padding: 0 !important;
      border: 0 !important;
      white-space: nowrap !important;
      clip-path: inset(50%) !important;
      clip: rect(0 0 0 0) !important;
      overflow: hidden !important;
    }
  `;
}
