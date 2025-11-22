export function getStyles(prefix: string): string {
  return `
    .${prefix}__wrapper {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      margin-top: 12px;
    }

    .${prefix}__nav {
      width: max-content;
      border-right: 1px solid #ddd;
      padding-right: 3em;
    }

    .${prefix}__nav ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .${prefix}__nav li {
      margin: 8px 0;
    }

    .${prefix}__nav a {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    /* Content area */
    .${prefix}__content {
      flex: 1;
      min-width: 420px;
    }

    .${prefix}__section {
      background: transparent;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .${prefix}__field {
      margin: 8px 0;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .${prefix}__field label {
      min-width: 220px;
      font-weight: 600;
    }

    .${prefix}__actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .${prefix}__topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .${prefix}__button--danger {
      color: #900;
      border-color: #900;
    }

    .${prefix}__note {
      color: #666;
      font-size: 0.95em;
      margin-top: 6px;
    }

    @media (max-width: 800px) {
      .${prefix}__wrapper {
        flex-direction: column;
      }

      .${prefix}__nav {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      }
    }
  `;
}
