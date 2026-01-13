/**
 * TodayView
 * ---------
 * Responsibility:
 * - Render TODAY’S REVENUE ACTIONS
 * - Visually communicate priority & urgency
 *
 * This component:
 * - Receives prepared data
 * - Returns HTML only
 *
 * This component NEVER:
 * - Fetches data
 * - Calculates scores
 * - Applies business logic
 */

class TodayView {
  render(actions = []) {
    if (!actions || actions.length === 0) {
      return `
        <div class="card">
          <h3>Today</h3>
          <p class="text-muted">No revenue actions for today.</p>
        </div>
      `;
    }

    const items = actions.map((p, index) => this._renderItem(p, index)).join("");

    return `
      <div>
        <h2 style="margin-bottom: 12px;">🔥 Today’s Revenue Actions</h2>
        ${items}
      </div>
    `;
  }

  /* =========================
     ITEM RENDERING
     ========================= */

  _renderItem(prospect, index) {
    const enforcement = prospect.enforcement;
    const flagsHtml = enforcement
      ? enforcement.flags.map(f => this._renderFlag(f)).join("")
      : "";

    return `
      <div class="card">
        <h3>
          #${index + 1} ${prospect.name}
        </h3>

        <p>
          <strong>Next Action:</strong> ${prospect.nextAction || "—"}
        </p>

        <p class="text-muted">
          Platform: ${prospect.platform} •
          Stage: ${this._formatStage(prospect.stage)} •
          Deal: $${prospect.dealValue}
        </p>

        <p class="text-muted">
          Score: ${prospect.score} • Idle: ${prospect.daysIdle} days
        </p>

        ${flagsHtml ? `<div>${flagsHtml}</div>` : ""}
      </div>
    `;
  }

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

export default TodayView;
