/**
 * ProspectCard (FINAL)
 * --------------------
 * Responsibility:
 * - Render a single prospect
 * - Provide ONE execution trigger
 *
 * This is the moment where:
 * UI → Action → Memory → Feedback → Pressure → Money
 *
 * This component:
 * - Renders data
 * - Triggers executeAction
 *
 * This component NEVER:
 * - Calculates logic
 * - Touches repositories directly
 */

import executeAction from "../actions/executeAction.js";

class ProspectCard {
  render(prospect, index = null) {
    if (!prospect) return "";

    return `
      <div class="card">
        <h3>
          ${index !== null ? `#${index + 1} ` : ""}
          ${prospect.name}
        </h3>

        <p>
          <strong>Next Action:</strong>
          ${prospect.nextAction || "—"}
        </p>

        <p class="text-muted">
          Platform: ${prospect.platform} •
          Stage: ${this._formatStage(prospect.stage)} •
          Deal: $${prospect.dealValue}
        </p>

        <p class="text-muted">
          Score: ${prospect.score ?? "—"} •
          Idle: ${prospect.daysIdle ?? 0} days
        </p>

        <button
          class="execute-btn"
          data-execute
          data-prospect-id="${prospect.id}"
        >
          ✅ Mark as Executed
        </button>
      </div>
    `;
  }

  /**
   * Bind execution handler safely
   * Called AFTER HTML is injected into DOM
   */
  bindEvents(rootElement) {
    const buttons = rootElement.querySelectorAll("[data-execute]");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const prospectId = button.getAttribute("data-prospect-id");

        try {
          executeAction({
            prospectId,
            actionType: "follow_up",
            meta: {
              preventedLoss: true,
              recovered: true
            }
          });

          // Optional immediate UI feedback
          button.textContent = "✔ Executed";
          button.disabled = true;

        } catch (err) {
          console.error("Execution failed:", err);
          alert("Failed to record execution.");
        }
      });
    });
  }

  _formatStage(stage) {
    return stage.replace("_", " ").toUpperCase();
  }
}

export default ProspectCard;
