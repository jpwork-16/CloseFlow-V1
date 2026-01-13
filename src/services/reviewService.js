/**
 * Review Service
 * --------------
 * Responsibility:
 * - Expose weekly review insights to the UI
 * - Act as a clean interface over reviewEngine
 *
 * This service:
 * - Calls reviewEngine
 * - Returns structured, UI-ready data
 *
 * This service NEVER:
 * - Touch storage
 * - Apply rules
 * - Make decisions
 */

import reviewEngine from "../logic/reviewEngine.js";

class ReviewService {
  /**
   * Public: get weekly review report
   */
  getWeeklyReview() {
    const review = reviewEngine.generateWeeklyReview();

    return {
      summaryScore: review.summaryScore,
      metrics: {
        missedFollowUps: review.metrics.missedFollowUps,
        avgIdleTime: review.metrics.avgIdleTime,
        conversionRate: review.metrics.conversionRate,
        lostDeals: review.metrics.lostDeals
      }
    };
  }
}

/**
 * Export singleton
 * One review service
 */
const reviewService = new ReviewService();
export default reviewService;
