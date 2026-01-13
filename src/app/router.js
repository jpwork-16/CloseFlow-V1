/**
 * Router
 * ------
 * Responsibility:
 * - Handle simple view switching
 * - Decide WHICH page is active
 *
 * This router is intentionally minimal.
 * No frameworks. No magic.
 */

import app from "./app.js";
import appState from "./state.js";

class Router {
  init() {
    // Initial app boot
    app.init();

    // Default route
    this.navigate("today");

    // Attach nav listeners (if UI exists)
    this._bindNavigation();
  }

  navigate(route) {
    switch (route) {
      case "today":
        this._renderToday();
        break;

      case "pipeline":
        this._renderPipeline();
        break;

      case "review":
        this._renderReview();
        break;

      default:
        console.warn(`Unknown route: ${route}`);
        this._renderToday();
    }
  }

  /* =========================
     RENDER HANDLERS
     ========================= */

  _renderToday() {
    const data = appState.getToday();
    console.log("ROUTE → TODAY", data);
  }

  _renderPipeline() {
    const data = appState.getPipeline();
    console.log("ROUTE → PIPELINE", data);
  }

  _renderReview() {
    const data = appState.getWeeklyReview();
    console.log("ROUTE → REVIEW", data);
  }

  /* =========================
     NAVIGATION BINDINGS
     ========================= */

  _bindNavigation() {
    document.addEventListener("click", e => {
      const target = e.target.closest("[data-route]");
      if (!target) return;

      const route = target.getAttribute("data-route");
      this.navigate(route);
    });
  }
}

/**
 * Export singleton
 * One routing authority
 */
const router = new Router();
export default router;
