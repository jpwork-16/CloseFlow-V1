/**
 * PipelineView
 * ------------
 * Responsibility:
 * - Render pipeline snapshot
 * - Show deal flow by stage
 * - Expose bottlenecks visually
 *
 * This component:
 * - Receives prepared pipeline data
 * - Returns HTML only
 *
 * This component NEVER:
 * - Fetches data
 * - Calculates metrics
 * - Applies business logic
 */

class PipelineView {
  render(stages = []) {
    if (!stages || stages.length === 0) {
      return `
        <div class="card">
          <h3>Pipeline</h3>
          <p class="text-muted">No pipeline data available.</p>
        </div>
      `;
    }

    const stageCards = stages.map(stage => this._renderStage(stage)).join("");

    return `
      <div>
        <h2 style="margin-bottom: 12px;">📊 Pipeline Snapshot</h2>
        ${stageCards}
      </div>
    `;
  }

  /* =========================
     STAGE RENDERING
     ========================= */

  _renderStage(stage) {
    return `
      <div class="card">
        <h3>${this._formatStage(stage.stage)}</h3>

        <p>
          <strong>Deals:</strong> ${stage.count}
        </p>

        <p>
          <strong>Total Value:</strong> $${stage.totalValue}
        </p>

        <p class="text-muted">
          Avg Idle Time: ${stage.avgIdleDays} days
        </p>
      </div>
    `;
  }

  _formatStage(stage) {
    return stage.replace("_", " ").toUpperCase();
  }
}

export default PipelineView;

