/**
 * UI Controller
 * -------------
 * Responsibility:
 * - Connect app state to the DOM
 * - Decide WHAT gets rendered (not HOW logic works)
 *
 * This controller:
 * - Reads from appState
 * - Delegates rendering to view components
 *
 * This file NEVER:
 * - Contains business logic
 * - Calculates priorities
 * - Touches storage
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
     RENDER ENTRY POINTS
     ========================= */

  renderToday() {
    const data = appState.getToday();
    this._render(this.todayView.render(data));
  }

  renderPipeline() {
    const data = appState.getPipeline();
    this._render(this.pipelineView.render(data));
  }

  renderReview() {
    const review = appState.getWeeklyReview();

    if (!review) {
      this._render("<p>No weekly review available.</p>");
      return;
    }

    const html = `
      <div class="card">
        <h3>Weekly Summary Score</h3>
        <p><strong>${review.summaryScore}</strong> / 100</p>
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
     INTERNAL
     ========================= */

  _render(html) {
    if (!this.appRoot) {
      console.error("UI root element #app not found");
      return;
    }

    this.appRoot.innerHTML = html;
  }
}

/**
 * Export singleton
 * One UI controller
 */
const uiController = new UIController();
export default uiController;
