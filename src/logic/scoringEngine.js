/**
 * Scoring Engine
 * --------------
 * Responsibility:
 * - Decide which prospects matter MOST today
 * - Convert raw prospect data into a comparable priority score
 *
 * This file:
 * - Reads config rules
 * - Reads prospect data (via repository)
 * - Produces deterministic scores
 *
 * This file NEVER:
 * - Touches UI
 * - Mutates data
 * - Enforces rules (that is enforcementEngine)
 */

import rules from "../config/rules.json" assert { type: "json" };
import prospectRepository from "../dataAccess/prospectRepository.js";

class ScoringEngine {
  /**
   * Public: score all active prospects
   */
  scoreAll() {
    const prospects = prospectRepository.getActive();

    return prospects
      .map(prospect => ({
        ...prospect,
        score: this._calculateScore(prospect)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Core scoring formula
   */
  _calculateScore(prospect) {
    const { scoring } = rules;

    let score = scoring.baseScore;

    score += this._dealValueScore(prospect);
    score += this._urgencyScore(prospect);
    score += this._recencyScore(prospect);
    score *= this._stageMultiplier(prospect);

    return Math.round(score);
  }

  /* =========================
     SCORING COMPONENTS
     ========================= */

  _dealValueScore(prospect) {
    const weight = rules.scoring.weights.dealValue;
    return prospect.dealValue * weight;
  }

  _urgencyScore(prospect) {
    const weight = rules.scoring.weights.urgency;
    return prospect.urgency * 10 * weight;
  }

  _recencyScore(prospect) {
    const { maxIdleDays, penaltyPerDay } = rules.scoring.recency;

    const idleDays = prospect.daysIdle || 0;

    if (idleDays <= 0) return 0;

    const penaltyDays = Math.min(idleDays, maxIdleDays);
    return -penaltyDays * penaltyPerDay;
  }

  _stageMultiplier(prospect) {
    const multiplier =
      rules.scoring.stageMultipliers[prospect.stage];

    return multiplier !== undefined ? multiplier : 1;
  }
}

/**
 * Export singleton
 * One scoring brain, one truth
 */
const scoringEngine = new ScoringEngine();
export default scoringEngine;

