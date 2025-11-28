export function getGlobalStyles(prefix: string): string {
  return `
    .${prefix}__hidden {
      display: none !important;
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
      
    .${prefix}__loader {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-left-color: currentColor;
      border-radius: 50%;
      animation: ${prefix}-spin 0.6s linear infinite;
    }
    
    @keyframes ${prefix}-spin {
      to { transform: rotate(360deg); }
    }

    .${prefix}__progress {
      position: relative;
      display: inline-block;
      width: 3em;
      height: 0.4em;
      background: rgba(0,0,0,0.15);
      border-radius: 2px;
      overflow: hidden;
      vertical-align: middle;
    }

    .${prefix}__progress-bar {
      display: block;
      height: 100%;
      width: 0%;
      background: currentColor;
      transition: width 0.15s linear;
    }
  `;
}
