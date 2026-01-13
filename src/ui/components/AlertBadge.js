/**
 * AlertBadge
 * ----------
 * Responsibility:
 * - Render a single enforcement alert (highlight / warning / critical)
 *
 * This component:
 * - Receives ONE alert object
 * - Returns HTML only
 *
 * This component NEVER:
 * - Decides severity
 * - Applies rules
 * - Fetches data
 */

class AlertBadge {
  render(alert) {
    if (!alert) return "";

    const className = this._getClass(alert.level);
    const icon = this._getIcon(alert.level);

    return `
      <span class="${className}">
        ${icon} ${alert.message}
      </span>
    `;
  }

  /* =========================
     INTERNAL HELPERS
     ========================= */

  _getClass(level) {
    switch (level) {
      case "CRITICAL":
        return "flag-critical";
      case "WARNING":
        return "flag-warning";
      case "HIGHLIGHT":
      default:
        return "flag-highlight";
    }
  }

  _getIcon(level) {
    switch (level) {
      case "CRITICAL":
        return "🔥";
      case "WARNING":
        return "⚠️";
      case "HIGHLIGHT":
      default:
        return "🔔";
    }
  }
}

export default AlertBadge;
