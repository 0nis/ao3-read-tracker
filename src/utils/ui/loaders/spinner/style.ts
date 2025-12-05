export function getStyles(prefix: string) {
  return `
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
  `;
}
