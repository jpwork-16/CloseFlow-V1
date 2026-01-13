/**
 * executeAction
 * -------------
 * Responsibility:
 * - Provide a single, clean UI action to record execution
 * - Trigger the full execution feedback loop
 *
 * This file is the MOMENT OF TRUTH:
 * Click → ExecutionService → Memory → Analytics → Review
 *
 * This file:
 * - Is called by UI components
 * - Calls executionService
 *
 * This file NEVER:
 * - Touches logic engines
 * - Updates UI directly
 * - Calculates anything
 */

import executionService from "../../services/executionService.js";
import appState from "../../app/state.js";

function executeAction({
  prospectId,
  actionType = "follow_up",
  meta = {}
}) {
  if (!prospectId) {
    throw new Error("executeAction requires prospectId");
  }

  // 1️⃣ Record execution (this is the core loop)
  const result = executionService.recordExecution(
    prospectId,
    actionType,
    meta
  );

  // 2️⃣ Refresh app state so UI reflects reality
  appState.loadToday();
  appState.loadPipeline();
  appState.loadWeeklyReview();

  // 3️⃣ Return result for optional UI feedback
  return result;
}

export default executeAction;

