/**
 * App Bootstrap
 * -------------
 * Responsibility:
 * - Initialize CloseFlow
 * - Load initial data into state
 * - Expose a simple interface for UI to call
 *
 * This file:
 * - Knows about state
 * - Triggers initial loads
 *
 * This file NEVER:
 * - Contains business logic
 * - Renders UI directly
 * - Touches storage
 */

import appState from "./state.js";

class App {
  init() {
    // Initial data load
    appState.loadToday();
    appState.loadPipeline();
    appState.loadWeeklyReview();

    console.log("CloseFlow initialized");
    console.log("Today Actions:", appState.getToday());
    console.log("Pipeline Snapshot:", appState.getPipeline());
    console.log("Weekly Review:", appState.getWeeklyReview());
  }

  /* =========================
     PUBLIC API (for UI)
     ========================= */

  refreshToday() {
    return appState.loadToday();
  }

  refreshPipeline() {
    return appState.loadPipeline();
  }

  refreshWeeklyReview() {
    return appState.loadWeeklyReview();
  }
}

/**
 * Export singleton
 * One application controller
 */
const app = new App();
export default app;
