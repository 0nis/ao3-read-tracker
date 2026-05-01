export function getStyles(prefix: string): string {
  return `
    .${prefix}__overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: opacity 300ms ease;
        opacity: 1;
    }

    .${prefix}--fadeout {
        opacity: 0;
        pointer-events: none;
    }

    .${prefix}__spinner {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 4px solid #ccc;
        border-top-color: #900;
        animation: ${prefix}-spin 0.8s linear infinite;
    }

    @keyframes ${prefix}-spin {
        to { transform: rotate(360deg); }
    }

    /* Screen-reader-only element */
    .${prefix}__sr {
        border: 0 !important;
        clip: rect(1px, 1px, 1px, 1px) !important;
        clip-path: inset(50%) !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        padding: 0 !important;
        position: absolute !important;
        white-space: nowrap !important;
        width: 1px !important;
    }
    `;
}
