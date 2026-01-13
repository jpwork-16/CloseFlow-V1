/**
 * TodayView
 * ---------
 * Responsibility:
 * - Render TODAY’S REVENUE ACTIONS
 * - Force CRITICAL visibility without hard blocking
 *
 * UX Principle:
 * - Pressure > annoyance
 * - Authority > force
 */

import ProspectCard from "./ProspectCard.js";
import AlertBadge from "./AlertBadge.js";

class TodayView {
  constructor() {
    this.card = new ProspectCard();
    this.alert = new AlertBadge();
    this.criticalAcknowledged = false;
  }

  render(actions = []) {
    if (!actions || actions.length === 0) {
      return `
        <div class="card">
          <h3>Today</h3>
          <p class="text-muted">No revenue actions for today.</p>
        </div>
      `;
    }

    const critical = actions.filter(
      p => p.enforcement && p.enforcement.isCritical
    );

    const normal = actions.filter(
      p => !p.enforcement || !p.enforcement.isCritical
    );

    const criticalSection = critical.length
      ? this._renderCriticalSection(critical)
      : "";

    const normalSection = this._renderNormalSection(normal, critical.length);

    return `
      <div>
        <h2 style="margin-bottom: 12px;">🔥 Today’s Revenue Actions</h2>
        ${criticalSection}
        ${normalSection}
      </div>
    `;
  }

  /* =========================
     CRITICAL SECTION
     ========================= */

  _renderCriticalSection(critical) {
    const banner = `
      <div class="critical-banner">
        🚨 ${critical.length} PROSPECT${critical.length > 1 ? "S" : ""} AT REVENUE RISK
        <br/>
        <span class="text-muted">
          These require immediate action.
        </span>
        <button class="ack-btn" data-ack-critical>
          I’ve seen this
        </button>
      </div>
    `;

    const items = critical
      .map((p, i) => this._renderAction(p, i, true))
      .join("");

    return `
      <section class="critical-section">
        ${banner}
        ${items}
      </section>
    `;
  }

  /* =========================
     NORMAL SECTION
     ========================= */

  _renderNormalSection(normal, hasCritical) {
    if (normal.length === 0) return "";

    const dimClass = hasCritical && !this.criticalAcknowledged
      ? "dimmed"
      : "";

    const items = normal
      .map((p, i) => this._renderAction(p, i))
      .join("");

    return `
      <section class="${dimClass}">
        ${items}
      </section>
    `;
  }

  /* =========================
     ACTION RENDERING
     ========================= */

  _renderAction(prospect, index, isCritical = false) {
    const alerts = prospect.enforcement
      ? prospect.enforcement.flags
          .map(flag => this.alert.render(flag))
          .join("<br/>")
      : "";

    return `
      <div class="${isCritical ? "critical-card" : ""}">
        ${this.card.render(prospect, index)}
        ${alerts ? `<div class="alert-stack">${alerts}</div>` : ""}
      </div>
    `;
  }

  /* =========================
     ACK HANDLER (SAFE)
     ========================= */

  bindEvents(rootElement) {
    const ackBtn = rootElement.querySelector("[data-ack-critical]");
    if (!ackBtn) return;

    ackBtn.addEventListener("click", () => {
      this.criticalAcknowledged = true;
      rootElement.querySelector(".dimmed")?.classList.remove("dimmed");
      ackBtn.remove();
    });
  }
}

export default TodayView;
