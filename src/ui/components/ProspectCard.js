/**
 * ProspectCard
 * ------------
 * Responsibility:
 * - Render a single prospect in a consistent, reusable format
 *
 * This component:
 * - Receives ONE prospect object
 * - Returns HTML only
 *
 * This component NEVER:
 * - Fetches data
 * - Calculates scores
 * - Applies business rules
 */

class ProspectCard {
  render(prospect, index = null) {
    if (!prospect) return "";

    const flagsHtml = prospect.enforcement
      ? prospect.enforcement.flags
          .map(flag => this._renderFlag(flag))
          .join("")
      : "";

    return `
      <div class="card">
        <h3>
          ${index !== null ? `#${index + 1} ` : ""}
          ${prospect.name}
        </h3>

        <p>
          <strong>Next Action:</strong>
          ${prospect.nextAction || "—"}
        </p>

        <p class="text-muted">
          Platform: ${prospect.platform} •
          Stage: ${this._formatStage(prospect.stage)} •
          Deal: $${prospect.dealValue}
        </p>

        <p class="text-muted">
          Score: ${prospect.score ?? "—"} •
          Idle: ${prospect.daysIdle ?? 0} days
        </p>

        ${flagsHtml ? `<div>${flagsHtml}</div>` : ""}
      </div>
    `;
  }

  /* =========================
     INTERNAL HELPERS
     ========================= */

  _renderFlag(flag) {
    let className = "flag-highlight";

    if (flag.level === "WARNING") className = "flag-warning";
    if (flag.level === "CRITICAL") className = "flag-critical";

    return `
      <span class="${className}">
        ⚠ ${flag.message}
      </span><br/>
    `;
  }

  _formatStage(stage) {
    return stage.replace("_", " ").toUpperCase();
  }
}

export default ProspectCard;

