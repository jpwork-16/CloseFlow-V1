/**
 * Pipeline Service
 * ----------------
 * Responsibility:
 * - Assemble pipeline intelligence for presentation
 * - Act as the interface between logic and UI
 *
 * This service:
 * - Calls pipelineEngine
 * - Formats data for easy rendering
 *
 * This service NEVER:
 * - Touch storage directly
 * - Apply business rules
 * - Make decisions
 */

import pipelineEngine from "../logic/pipelineEngine.js";

class PipelineService {
  /**
   * Public: get pipeline data ready for UI
   */
  getPipelineSnapshot() {
    const snapshot = pipelineEngine.getSnapshot();

    return Object.values(snapshot).map(stageData => ({
      stage: stageData.stage,
      count: stageData.count,
      totalValue: stageData.totalValue,
      avgIdleDays: stageData.avgIdleDays,
      prospects: stageData.prospects
    }));
  }
}

/**
 * Export singleton
 * One pipeline assembler
 */
const pipelineService = new PipelineService();
export default pipelineService;
