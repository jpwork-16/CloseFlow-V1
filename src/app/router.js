/**
 * Router
 * ------
 * Responsibility:
 * - Control view switching
 * - Bridge navigation → UI rendering
 *
 * This router:
 * - Boots the app
 * - Calls UIController explicitly
 *
 * UI never decides routing.
 */

import app from "./app.js";
import appState from "./state.js";
import uiController from "../ui/uiController.js";

class Router {
  init() {
    // Boot core application
    app.init();

    // Default route
    this.navigate("today");

    // Bind navigation events
    this._bindNavigation();
  }

  navigate(route) {
    switch (route) {
      case "today":
        appState.loadToday();
        uiController.renderToday();
        break;

      case "pipeline":
        appState.loadPipeline();
        uiController.renderPipeline();
        break;

      case "review":
        appState.loadWeeklyReview();
        uiController.renderReview();
        break;

      default:
        console.warn(`Unknown route: ${route}`);
        appState.loadToday();
        uiController.renderToday();
    }
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
