/**
 * Execution Analytics Engine
 * --------------------------
 * Responsibility:
 * - Convert execution events into insights
 * - Quantify discipline, hesitation, and recovery
 * - Feed Weekly Review, authority metrics, and pricing justification
 *
 * This engine answers:
 * - Did you act?
 * - Did you act on time?
 * - What did that action save or cost you?
 *
 * This engine NEVER:
 * - Touches UI
 * - Mutates prospect data
 * - Applies enforcement rules
 */

import prospectRepository from "../dataAccess/prospectRepository.js";
import storage from "../dataAccess/storage.js";

class ExecutionAnalyticsEngine {
  /**
   * Public: generate execution analytics snapshot
   */
  generateAnalytics() {
    const events = storage._history || [];
    const prospects = prospectRepository.getAll();

    return {
      executionVolume: this._executionVolume(events),
      executionDiscipline: this._executionDiscipline(events),
      recoveryStats: this._recoveryStats(events, prospects),
      hesitationStats: this._hesitationStats(events, prospects),
      moneyImpact: this._moneyImpact(events, prospects)
    };
  }

  /* =========================
     ANALYTICS MODULES
     ========================= */

  _executionVolume(events) {
    const byDay = {};

    events.forEach(evt => {
      const day = evt.timestamp.split("T")[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });

    return {
      totalExecutions: events.length,
      executionsByDay: byDay
    };
  }

  _executionDiscipline(events) {
    if (events.length === 0) {
      return {
        avgActionsPerDay: 0,
        consistencyScore: 0
      };
    }

    const days = new Set(
      events.map(e => e.timestamp.split("T")[0])
    );

    const avgActionsPerDay =
      events.length / days.size;

    // Consistency score rewards spreading actions across days
    const consistencyScore = Math.min(
      100,
      Math.round((days.size / events.length) * 100)
    );

    return {
      avgActionsPerDay: Number(avgActionsPerDay.toFixed(2)),
      consistencyScore
    };
  }

  _recoveryStats(events, prospects) {
    let recoveredDeals = 0;
    let recoveredValue = 0;

    events.forEach(evt => {
      const prospect = prospects.find(
        p => p.id === evt.prospectId
      );

      if (!prospect) return;

      if (evt.meta?.recovered === true) {
        recoveredDeals += 1;
        recoveredValue += prospect.dealValue || 0;
      }
    });

    return {
      recoveredDeals,
      recoveredValue
    };
  }

  _hesitationStats(events, prospects) {
    let delayedActions = 0;

    events.forEach(evt => {
      const prospect = prospects.find(
        p => p.id === evt.prospectId
      );

      if (!prospect) return;

      if ((prospect.daysIdle || 0) >= 5) {
        delayedActions += 1;
      }
    });

    return {
      delayedActions
    };
  }

  _moneyImpact(events, prospects) {
    let moneySaved = 0;
    let moneyAtRisk = 0;

    events.forEach(evt => {
      const prospect = prospects.find(
        p => p.id === evt.prospectId
      );

      if (!prospect) return;

      // Saved money if action taken on critical prospect
      if (evt.meta?.preventedLoss === true) {
        moneySaved += prospect.dealValue || 0;
      }

      // Money at risk if action was delayed
      if ((prospect.daysIdle || 0) >= 7) {
        moneyAtRisk += prospect.dealValue || 0;
      }
    });

    return {
      moneySaved,
      moneyAtRisk
    };
  }
}

/**
 * Export singleton
 * One execution intelligence source
 */
const executionAnalyticsEngine = new ExecutionAnalyticsEngine();
export default executionAnalyticsEngine;

