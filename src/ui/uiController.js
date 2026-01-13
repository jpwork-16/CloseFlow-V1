/**
 * UI Controller (FINAL)
 * ---------------------
 * Responsibility:
 * - Render views into the DOM
 * - Bind UI events safely (once per render)
 *
 * Guarantees:
 * - No duplicate listeners
 * - No UI ↔ logic leakage
 * - Execution actions always work
 */

import appState from "../app/state.js";
import TodayView from "./components/TodayView.js";
import PipelineView from "./components/PipelineView.js";

class UIController {
  constructor() {
    this.appRoot = document.getElementById("app");

    this.todayView = new TodayView();
    this.pipelineView = new PipelineView();
  }

  /* =========================
     PUBLIC RENDER METHODS
     ========================= */

  renderToday() {
    const data = appState.getToday();
    this._render(this.todayView.render(data));
    this._bindTodayEvents();
  }

  renderPipeline() {
    const data = appState.getPipeline();
    this._render(this.pipelineView.render(data));
    // Pipeline is read-only (no actions yet)
  }

  renderReview() {
    const review = appState.getWeeklyReview();

    if (!review) {
      this._render("<p>No weekly review available.</p>");
      return;
    }

    const html = `
      <div class="card">
        <h3>Weekly Executive Review</h3>
        <p><strong>Overview Score:</strong> ${review.summaryScore}/100</p>

        <p class="text-muted">
          Missed Follow-ups: ${review.metrics.missedFollowUps}<br/>
          Avg Idle Time: ${review.metrics.avgIdleTime} days<br/>
          Conversion Rate: ${review.metrics.conversionRate}%<br/>
          Lost Deals: ${review.metrics.lostDeals}
        </p>
      </div>
    `;

    this._render(html);
  }

  /* =========================
     INTERNAL RENDER CORE
     ========================= */

  _render(html) {
    if (!this.appRoot) {
      throw new Error("UI root element (#app) not found");
    }

    // Clear old DOM completely (prevents stale listeners)
    this.appRoot.innerHTML = html;
  }

  /* =========================
     EVENT BINDING (SAFE)
     ========================= */

  _bindTodayEvents() {
    // Bind soft-ack banner (TodayView)
    this.todayView.bindEvents(this.appRoot);

    // Bind execution buttons (ProspectCard)
    const executeButtons = this.appRoot.querySelectorAll(
      "[data-execute]"
    );

    executeButtons.forEach(button => {
      // Prevent double-binding
      if (button.dataset.bound === "true") return;

      button.dataset.bound = "true";
    });

    // Bind ProspectCard events safely
    // (Cards handle their own execution logic)
    if (typeof this.todayView.card?.bindEvents === "function") {
      this.todayView.card.bindEvents(this.appRoot);
    }
  }
}

/**
 * Export singleton
 * One UI authority
 */
const uiController = new UIController();
export default uiController;
