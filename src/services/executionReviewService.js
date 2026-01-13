/**
 * Execution Review Service
 * ------------------------
 * Responsibility:
 * - Package execution analytics into executive-level insights
 * - Produce weekly summaries that justify action, pricing, and accountability
 *
 * This service:
 * - Calls executionAnalyticsEngine
 * - Shapes insights for review consumption
 *
 * This service NEVER:
 * - Touches UI directly
 * - Mutate prospect data
 * - Decide enforcement rules
 */

import executionAnalyticsEngine from "../logic/executionAnalyticsEngine.js";
import reviewEngine from "../logic/reviewEngine.js";

class ExecutionReviewService {
  /**
   * Public: generate executive execution review
   * This is the CEO-mode output.
   */
  generateExecutiveReview() {
    const analytics = executionAnalyticsEngine.generateAnalytics();
    const baseReview = reviewEngine.generateWeeklyReview();

    const moneySummary = this._buildMoneySummary(analytics.moneyImpact);
    const disciplineSummary = this._buildDisciplineSummary(
      analytics.executionDiscipline
    );
    const recoverySummary = this._buildRecoverySummary(
      analytics.recoveryStats
    );

    return {
      overviewScore: this._calculateOverviewScore({
        discipline: analytics.executionDiscipline,
        moneyImpact: analytics.moneyImpact,
        baseScore: baseReview.summaryScore
      }),

      baseMetrics: baseReview.metrics,

      execution: {
        volume: analytics.executionVolume,
        discipline: analytics.executionDiscipline,
        hesitation: analytics.hesitationStats
      },

      money: moneySummary,
      recovery: recoverySummary,
      disciplineSummary
    };
  }

  /* =========================
     SUMMARY BUILDERS
     ========================= */

  _buildMoneySummary(moneyImpact) {
    return {
      saved: moneyImpact.moneySaved,
      atRisk: moneyImpact.moneyAtRisk,
      message:
        moneyImpact.moneySaved > 0
          ? `You protected $${moneyImpact.moneySaved} in potential revenue.`
          : "No revenue protection actions recorded."
    };
  }

  _buildDisciplineSummary(discipline) {
    return {
      avgActionsPerDay: discipline.avgActionsPerDay,
      consistencyScore: discipline.consistencyScore,
      message:
        discipline.consistencyScore >= 70
          ? "Execution discipline is strong."
          : "Execution discipline is slipping. Increase daily follow-through."
    };
  }

  _buildRecoverySummary(recoveryStats) {
    return {
      recoveredDeals: recoveryStats.recoveredDeals,
      recoveredValue: recoveryStats.recoveredValue,
      message:
        recoveryStats.recoveredDeals > 0
          ? `You revived ${recoveryStats.recoveredDeals} deal(s) worth $${recoveryStats.recoveredValue}.`
          : "No recovered deals this period."
    };
  }

  /* =========================
     EXECUTIVE OVERVIEW SCORE
     ========================= */

  _calculateOverviewScore({ discipline, moneyImpact, baseScore }) {
    let score = baseScore;

    // Reward consistency
    score += discipline.consistencyScore * 0.2;

    // Reward money saved
    score += moneyImpact.moneySaved > 0 ? 10 : 0;

    // Penalize money at risk
    score -= moneyImpact.moneyAtRisk > 0 ? 10 : 0;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

/**
 * Export singleton
 * One executive review authority
 */
const executionReviewService = new ExecutionReviewService();
export default executionReviewService;

