/**
 * Global App State
 * ----------------
 * Responsibility:
 * - Hold current app data in memory
 * - Act as a single source of truth for the UI
 *
 * This file:
 * - Calls services
 * - Stores derived data (today, pipeline, review)
 *
 * This file NEVER:
 * - Contains business logic
 * - Touches storage directly
 * - Decides rules
 */

import todayService from "../services/todayService.js";
import pipelineService from "../services/pipelineService.js";
import reviewService from "../services/reviewService.js";

class AppState {
  constructor() {
    this.state = {
      todayActions: [],
      pipeline: [],
      weeklyReview: null,
      lastUpdated: null
    };
  }

  /* =========================
     LOADERS
     ========================= */

  loadToday() {
    this.state.todayActions = todayService.getTodayActions();
    this._touch();
    return this.state.todayActions;
  }

  loadPipeline() {
    this.state.pipeline = pipelineService.getPipelineSnapshot();
    this._touch();
    return this.state.pipeline;
  }

  loadWeeklyReview() {
    this.state.weeklyReview = reviewService.getWeeklyReview();
    this._touch();
    return this.state.weeklyReview;
  }

  /* =========================
     GETTERS
     ========================= */

  getToday() {
    return this.state.todayActions;
  }

  getPipeline() {
    return this.state.pipeline;
  }

  getWeeklyReview() {
    return this.state.weeklyReview;
  }

  getLastUpdated() {
    return this.state.lastUpdated;
  }

  /* =========================
     INTERNAL
     ========================= */

  _touch() {
    this.state.lastUpdated = new Date().toISOString();
  }
}

/**
 * Export singleton
 * One global app state
 */
const appState = new AppState();
export default appState;

