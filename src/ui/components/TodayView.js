/**
 * TodayView (FINAL – Options 1–6)
 * --------------------------------
 * Purpose:
 * - Render TODAY’S REVENUE ACTIONS
 * - Enforce execution psychologically (not annoyingly)
 *
 * Included:
 * 1. Enforcement escalation
 * 2. Critical-first + soft acknowledgment
 * 3. Shame loop (missed last week)
 * 4. Time-decay visualization
 * 5. Execution streaks (positive reinforcement)
 * 6. Recovery rewards (deal revived)
 */

import ProspectCard from "./ProspectCard.js";
import AlertBadge from "./AlertBadge.js";

class TodayView {
  constructor() {
    this.card = new ProspectCard();
    this.alert = new AlertBadge();

    // Session-level soft lock
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

    return `
      <div>
        <h2 style="margin-bottom: 12px;">🔥 Today’s Revenue Actions</h2>

        ${critical.length ? this._renderCriticalSection(critical) : ""}

        ${this._renderNormalSection(normal, critical.length)}
      </div>
    `;
  }

  /* =========================
     CRITICAL SECTION
     ========================= */

  _renderCriticalSection(critical) {
    return `
      <section class="critical-section">
        <div class="critical-banner">
          🚨 ${critical.length} PROSPECT${critical.length > 1 ? "S" : ""} AT REVENUE RISK
          <br/>
          <span class="text-muted">
            These were neglected. Immediate action required.
          </span>
          <button class="ack-btn" data-ack-critical>
            I’ve seen this
          </button>
        </div>

        ${critical.map((p, i) => this._renderAction(p, i, true)).join("")}
      </section>
    `;
  }

  /* =========================
     NORMAL SECTION (SOFT LOCK)
     ========================= */

  _renderNormalSection(normal, hasCritical) {
    if (!normal.length) return "";

    const dimClass =
      hasCritical && !this.criticalAcknowledged ? "dimmed" : "";

    return `
      <section class="${dimClass}">
        ${normal.map((p, i) => this._renderAction(p, i)).join("")}
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
      <div class="${this._getTimeDecayClass(prospect)} ${isCritical ? "critical-card" : ""}">
        ${this.card.render(prospect, index)}
        ${this._renderShameTag(prospect)}
        ${this._renderStreakTag(prospect)}
        ${this._renderRecoveryTag(prospect)}
        ${alerts ? `<div class="alert-stack">${alerts}</div>` : ""}
      </div>
    `;
  }

  /* =========================
     OPTION 3 — SHAME LOOP
     ========================= */

  _renderShameTag(prospect) {
    if (prospect.wasCriticalLastWeek) {
      return `<div class="shame-tag">⚠ Missed last week</div>`;
    }
    return "";
  }

  /* =========================
     OPTION 4 — TIME DECAY
     ========================= */

  _getTimeDecayClass(prospect) {
    const idle = prospect.daysIdle || 0;

    if (idle >= 7) return "decay-high";
    if (idle >= 4) return "decay-medium";
    if (idle >= 2) return "decay-low";

    return "";
  }

  /* =========================
     OPTION 5 — STREAKS
     ========================= */

  _renderStreakTag(prospect) {
    if (prospect.executionStreak && prospect.executionStreak >= 3) {
      return `
        <div class="streak-tag">
          🔥 ${prospect.executionStreak}-day execution streak
        </div>
      `;
    }
    return "";
  }

  /* =========================
     OPTION 6 — RECOVERY REWARD
     ========================= */

  _renderRecoveryTag(prospect) {
    if (prospect.recoveredRecently) {
      return `
        <div class="recovery-tag">
          ✅ Deal revived from neglect
        </div>
      `;
    }
    return "";
  }

  /* =========================
     EVENT BINDING
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
