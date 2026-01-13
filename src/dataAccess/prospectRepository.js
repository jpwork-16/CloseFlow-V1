/**
 * Prospect Repository
 * -------------------
 * Purpose:
 * - Provide a clean API for working with prospects
 * - Hide storage implementation details
 *
 * This file contains:
 * - ZERO business logic
 * - ZERO scoring
 * - ZERO enforcement
 *
 * It only expresses "what can be done with prospects".
 */

import storage from "./storage.js";

class ProspectRepository {
  /* =========================
     READ OPERATIONS
     ========================= */

  getAll() {
    return storage.getAllProspects();
  }

  getById(id) {
    if (!id) {
      throw new Error("getById requires a prospect id");
    }
    return storage.getProspectById(id);
  }

  getActive() {
    return storage
      .getAllProspects()
      .filter(prospect => prospect.status === "active");
  }

  getByStage(stage) {
    if (!stage) {
      throw new Error("getByStage requires a stage");
    }

    return storage
      .getAllProspects()
      .filter(prospect => prospect.stage === stage);
  }

  /* =========================
     WRITE OPERATIONS
     ========================= */

  add(prospect) {
    this._validateProspect(prospect);
    return storage.addProspect(prospect);
  }

  update(prospect) {
    this._validateProspect(prospect);
    return storage.updateProspect(prospect);
  }

  /* =========================
     INTERNAL VALIDATION
     ========================= */

  _validateProspect(prospect) {
    if (!prospect) {
      throw new Error("Prospect is required");
    }

    const requiredFields = [
      "id",
      "name",
      "platform",
      "offer",
      "stage",
      "dealValue",
      "urgency",
      "lastContact",
      "status"
    ];

    requiredFields.forEach(field => {
      if (prospect[field] === undefined || prospect[field] === null) {
        throw new Error(`Prospect missing required field: ${field}`);
      }
    });
  }
}

/**
 * Export singleton
 * One repository, one data truth
 */
const prospectRepository = new ProspectRepository();
export default prospectRepository;

