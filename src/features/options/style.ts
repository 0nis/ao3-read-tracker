export function getStyles(prefix: string): string {
  return `
    .${prefix}__wrapper {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      margin-top: 12px;
    }

    .${prefix}__content {
      flex: 1;
      width: 100%;
    }

    .${prefix}__section {
      background: transparent;
      padding: 0 0 10px 0;
    }

    .${prefix}__section-title {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .${prefix}__section-description {
      opacity: 0.8;
      font-size: 0.95em;
    }

    .${prefix}__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .${prefix}__header-actions {
      display: flex;
      gap: 8px;
    }

    .${prefix}__header-actions li {
      position: relative;
      display: inline-block;
      margin: 0;
      padding: 0;
    }

    .${prefix}__header-actions li button {
      margin: 0;
    }
    
    .${prefix}__button {
      cursor: pointer;
    }

    .${prefix}__button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .${prefix}__button--danger {
      color: #900 !important;
      border-color: #900 !important;
    }

    @media (max-width: 600px) {
      .${prefix}__wrapper {
        flex-direction: column;
        position: relative;
      }

      .${prefix}__header-actions {
        display: none;
      }
    }
  `;
}
