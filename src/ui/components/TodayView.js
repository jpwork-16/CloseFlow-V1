/**
 * TodayView
 * ---------
 * Responsibility:
 * - Render TODAY’S REVENUE ACTIONS
 * - Emphasize urgency, priority, and next action
 *
 * This component:
 * - Uses reusable UI primitives
 * - Returns HTML only
 *
 * This component NEVER:
 * - Fetches data
 * - Calculates logic
 * - Knows about rules
 */

import ProspectCard from "./ProspectCard.js";
import AlertBadge from "./AlertBadge.js";

class TodayView {
  constructor() {
    this.card = new ProspectCard();
    this.alert = new AlertBadge();
  }

  render(actions = []) {
    if (!actions || actions.length === 0) {
      return `
        <div class="card">
          <h3>Today</h3>
          <p class="text-muted">
            No revenue actions for today.
          </p>
        </div>
      `;
    }

    const items = actions
      .map((prospect, index) => this._renderAction(prospect, index))
      .join("");

    return `
      <div>
        <h2 style="margin-bottom: 12px;">
          🔥 Today’s Revenue Actions
        </h2>
        ${items}
      </div>
    `;
  }

  /* =========================
     INTERNAL RENDERING
     ========================= */

  _renderAction(prospect, index) {
    const enforcement = prospect.enforcement;

    const alertsHtml = enforcement
      ? enforcement.flags
          .map(flag => this.alert.render(flag))
          .join("<br/>")
      : "";

    return `
      ${this.card.render(prospect, index)}
      ${alertsHtml ? `<div style="margin-bottom: 12px;">${alertsHtml}</div>` : ""}
    `;
  }
}

export default TodayView;
