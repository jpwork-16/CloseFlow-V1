/**
 * Review Engine
 * -------------
 * Responsibility:
 * - Generate weekly execution insights
 * - Expose revenue leaks
 * - Provide executive-level accountability
 *
 * This engine:
 * - Reads prospect data
 * - Aggregates performance metrics
 *
 * This engine NEVER:
 * - Touch UI
 * - Enforce rules directly
 * - Mutate data
 */

import rules from "../config/rules.json" assert { type: "json" };
import prospectRepository from "../dataAccess/prospectRepository.js";

class ReviewEngine {
  /**
   * Public: generate weekly review report
   */
  generateWeeklyReview() {
    const prospects = prospectRepository.getAll();

    const missedFollowUps = this._calculateMissedFollowUps(prospects);
    const avgIdleTime = this._calculateAvgIdleTime(prospects);
    const conversionRate = this._calculateConversionRate(prospects);
    const lostDeals = this._calculateLostDeals(prospects);

    return {
      summaryScore: this._calculateSummaryScore({
        missedFollowUps,
        avgIdleTime,
        conversionRate,
        lostDeals
      }),
      metrics: {
        missedFollowUps,
        avgIdleTime,
        conversionRate,
        lostDeals
      }
    };
  }

  /* =========================
     METRIC CALCULATIONS
     ========================= */

  _calculateMissedFollowUps(prospects) {
    const criticalIdle = rules.enforcement.idleThresholds.critical;

    return prospects.filter(
      p => p.status === "active" && (p.daysIdle || 0) >= criticalIdle
    ).length;
  }

  _calculateAvgIdleTime(prospects) {
    const active = prospects.filter(p => p.status === "active");
    if (active.length === 0) return 0;

    const totalIdle = active.reduce(
      (sum, p) => sum + (p.daysIdle || 0),
      0
    );

    return Math.round(totalIdle / active.length);
  }

  _calculateConversionRate(prospects) {
    const closed = prospects.filter(p => p.stage === "closed").length;
    const lost = prospects.filter(p => p.stage === "lost").length;

    const totalFinished = closed + lost;
    if (totalFinished === 0) return 0;

    return Math.round((closed / totalFinished) * 100);
  }

  _calculateLostDeals(prospects) {
    return prospects.filter(p => p.stage === "lost").length;
  }

  /* =========================
     EXECUTIVE SUMMARY SCORE
     ========================= */

  _calculateSummaryScore({ missedFollowUps, avgIdleTime, conversionRate, lostDeals }) {
    const weights = rules.review.weekly;

    let score = 100;

    score -= missedFollowUps * 10 * weights.missedFollowUpsWeight;
    score -= avgIdleTime * weights.avgIdleWeight;
    score += conversionRate * weights.conversionWeight;
    score -= lostDeals * 5 * weights.lostDealsWeight;

    return Math.max(0, Math.round(score));
  }
}

/**
 * Export singleton
 * One review authority
 */
const reviewEngine = new ReviewEngine();
export default reviewEngine;
