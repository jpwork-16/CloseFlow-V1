/**
 * Execution Service
 * -----------------
 * Responsibility:
 * - Record execution events (actions taken by the coach)
 * - Update prospect execution metadata
 * - Power streaks, shame-loop, and recovery rewards
 *
 * This service is the MISSING LINK:
 * Action → Outcome → Memory → Feedback
 *
 * This service:
 * - Mutates prospect state (via repository)
 * - Writes execution events to history
 *
 * This service NEVER:
 * - Touches UI
 * - Applies scoring logic
 * - Decides priorities
 */

import prospectRepository from "../dataAccess/prospectRepository.js";
import storage from "../dataAccess/storage.js";

class ExecutionService {
  /**
   * Record that an action was executed on a prospect
   *
   * @param {string} prospectId
   * @param {string} actionType - e.g. "follow_up", "sent_offer", "closed_deal"
   * @param {object} meta - optional extra info (notes, outcome, value)
   */
  recordExecution(prospectId, actionType, meta = {}) {
    const prospect = prospectRepository.getById(prospectId);

    if (!prospect) {
      throw new Error(`Prospect ${prospectId} not found`);
    }

    const now = new Date().toISOString();

    // 1️⃣ Log execution event (system memory)
    this._logExecutionEvent({
      prospectId,
      actionType,
      timestamp: now,
      meta
    });

    // 2️⃣ Update execution streak
    const updatedStreak = this._updateExecutionStreak(prospect);

    // 3️⃣ Detect recovery (critical → acted)
    const recoveredRecently =
      prospect.enforcement?.isCritical === true;

    // 4️⃣ Update prospect state
    const updatedProspect = {
      ...prospect,
      lastContact: now,
      daysIdle: 0,
      executionStreak: updatedStreak,
      recoveredRecently,
      wasCriticalLastWeek: false // reset shame flag on action
    };

    prospectRepository.update(updatedProspect);

    return {
      success: true,
      prospectId,
      executionStreak: updatedStreak,
      recoveredRecently
    };
  }

  /* =========================
     INTERNAL HELPERS
     ========================= */

  _updateExecutionStreak(prospect) {
    const lastContact = prospect.lastContact
      ? new Date(prospect.lastContact)
      : null;

    const now = new Date();

    if (!lastContact) {
      return 1;
    }

    const diffDays = Math.floor(
      (now - lastContact) / (1000 * 60 * 60 * 24)
    );

    // Same-day or next-day execution → streak continues
    if (diffDays <= 1) {
      return (prospect.executionStreak || 0) + 1;
    }

    // Gap too large → streak resets
    return 1;
  }

  _logExecutionEvent(event) {
    const history = storage._history || [];

    history.push({
      id: `evt_${Date.now()}`,
      ...event
    });

    storage._history = history;
  }
}

/**
 * Export singleton
 * One execution authority
 */
const executionService = new ExecutionService();
export default executionService;

