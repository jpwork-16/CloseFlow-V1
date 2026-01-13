/**
 * Pipeline Engine
 * ---------------
 * Responsibility:
 * - Aggregate deal flow by stage
 * - Expose bottlenecks and value concentration
 *
 * This engine:
 * - Reads prospects
 * - Computes pipeline metrics
 *
 * This engine NEVER:
 * - Touches UI
 * - Enforces rules
 * - Mutates data
 */

import rules from "../config/rules.json" assert { type: "json" };
import prospectRepository from "../dataAccess/prospectRepository.js";

class PipelineEngine {
  /**
   * Public: get pipeline snapshot
   */
  getSnapshot() {
    const prospects = prospectRepository.getActive();
    const stages = rules.pipeline.stages;

    const snapshot = {};

    stages.forEach(stage => {
      snapshot[stage] = {
        stage,
        count: 0,
        totalValue: 0,
        avgIdleDays: 0,
        prospects: []
      };
    });

    prospects.forEach(prospect => {
      const stageBucket = snapshot[prospect.stage];
      if (!stageBucket) return;

      stageBucket.count += 1;
      stageBucket.totalValue += prospect.dealValue || 0;
      stageBucket.avgIdleDays += prospect.daysIdle || 0;
      stageBucket.prospects.push(prospect);
    });

    // Finalize averages
    Object.values(snapshot).forEach(bucket => {
      if (bucket.count > 0) {
        bucket.avgIdleDays = Math.round(
          bucket.avgIdleDays / bucket.count
        );
      }
    });

    return snapshot;
  }
}

/**
 * Export singleton
 * One pipeline intelligence source
 */
const pipelineEngine = new PipelineEngine();
export default pipelineEngine;

