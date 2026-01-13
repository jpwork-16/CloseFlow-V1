/**
 * Enforcement Engine
 * ------------------
 * Responsibility:
 * - Detect neglect
 * - Flag risky prospects
 * - Create psychological pressure to act
 *
 * This engine does NOT:
 * - Change scores
 * - Touch UI
 * - Mutate storage directly
 *
 * It only evaluates reality.
 */

import rules from "../config/rules.json" assert { type: "json" };
import prospectRepository from "../dataAccess/prospectRepository.js";

class EnforcementEngine {
  /**
   * Evaluate all active prospects and attach enforcement flags
   */
  evaluateAll() {
    const prospects = prospectRepository.getActive();

    return prospects.map(prospect => ({
      ...prospect,
      enforcement: this._evaluateProspect(prospect)
    }));
  }

  /**
   * Core enforcement logic per prospect
   */
  _evaluateProspect(prospect) {
    const { idleThresholds, rules: stageRules } = rules.enforcement;

    const idleDays = prospect.daysIdle || 0;
    const flags = [];

    // Global idle enforcement
    if (idleDays >= idleThresholds.critical) {
      flags.push(this._flag("CRITICAL", "Revenue at risk"));
    } else if (idleDays >= idleThresholds.warning) {
      flags.push(this._flag("WARNING", "Follow-up overdue"));
    } else if (idleDays >= idleThresholds.highlight) {
      flags.push(this._flag("HIGHLIGHT", "Needs attention"));
    }

    // Stage-specific enforcement
    this._applyStageRules(prospect, stageRules, idleDays, flags);

    return {
      idleDays,
      flags,
      isCritical: flags.some(f => f.level === "CRITICAL")
    };
  }

  /* =========================
     STAGE-SPECIFIC RULES
     ========================= */

  _applyStageRules(prospect, stageRules, idleDays, flags) {
    switch (prospect.stage) {
      case "offer_sent":
        if (idleDays >= stageRules.offerSentIdleLimit) {
          flags.push(
            this._flag(
              "CRITICAL",
              "Offer sent but no follow-up"
            )
          );
        }
        break;

      case "warm":
        if (idleDays >= stageRules.warmLeadIdleLimit) {
          flags.push(
            this._flag(
              "WARNING",
              "Warm lead cooling down"
            )
          );
        }
        break;

      case "conversation":
        if (idleDays >= stageRules.conversationIdleLimit) {
          flags.push(
            this._flag(
              "HIGHLIGHT",
              "Conversation going cold"
            )
          );
        }
        break;

      default:
        break;
    }
  }

  /* =========================
     FLAG BUILDER
     ========================= */

  _flag(level, message) {
    return {
      level, // HIGHLIGHT | WARNING | CRITICAL
      message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Export singleton
 * One enforcement authority
 */
const enforcementEngine = new EnforcementEngine();
export default enforcementEngine;

