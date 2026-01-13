/**
 * Today Service
 * -------------
 * Responsibility:
 * - Assemble TODAY’S REVENUE ACTIONS
 * - Merge scoring + enforcement
 * - Decide what must be acted on NOW
 *
 * This service:
 * - Calls logic engines
 * - Applies Today View rules
 * - Outputs a clean action list
 *
 * This service NEVER:
 * - Touches UI
 * - Mutates storage
 * - Contains business rules itself
 */

import rules from "../config/rules.json" assert { type: "json" };
import scoringEngine from "../logic/scoringEngine.js";
import enforcementEngine from "../logic/enforcementEngine.js";

class TodayService {
  /**
   * Public: get today's revenue actions
   */
  getTodayActions() {
    const scoredProspects = scoringEngine.scoreAll();
    const enforcedProspects = enforcementEngine.evaluateAll();

    const merged = this._mergeScoreAndEnforcement(
      scoredProspects,
      enforcedProspects
    );

    const prioritized = this._prioritize(merged);

    return prioritized.slice(0, rules.todayView.maxItems);
  }

  /* =========================
     INTERNAL ASSEMBLY
     ========================= */

  _mergeScoreAndEnforcement(scored, enforced) {
    const enforcementMap = new Map(
      enforced.map(p => [p.id, p.enforcement])
    );

    return scored.map(prospect => ({
      ...prospect,
      enforcement: enforcementMap.get(prospect.id) || null
    }));
  }

  _prioritize(prospects) {
    const { criticalAlwaysIncluded } = rules.todayView;

    let critical = [];
    let normal = [];

    prospects.forEach(prospect => {
      if (
        criticalAlwaysIncluded &&
        prospect.enforcement &&
        prospect.enforcement.isCritical
      ) {
        critical.push(prospect);
      } else {
        normal.push(prospect);
      }
    });

    // Sort normal prospects by score descending
    normal.sort((a, b) => b.score - a.score);

    return [...critical, ...normal];
  }
}

/**
 * Export singleton
 * One daily execution assembler
 */
const todayService = new TodayService();
export default todayService;

