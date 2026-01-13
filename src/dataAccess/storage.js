/**
 * Storage Layer
 * ----------------
 * Single responsibility:
 * - Read data
 * - Write data
 * - Nothing else
 *
 * This version assumes JSON-file–like data sources (V1).
 * Later, this can be swapped for LocalStorage / DB / API
 * without changing any logic layer.
 */

import prospectsData from "../data/prospects.json" assert { type: "json" };

class Storage {
  constructor() {
    // In-memory cache (V1)
    this._prospects = prospectsData.prospects || [];
  }

  /* =========================
     PROSPECT STORAGE
     ========================= */

  getAllProspects() {
    return [...this._prospects];
  }

  getProspectById(id) {
    return this._prospects.find(p => p.id === id) || null;
  }

  saveAllProspects(prospects) {
    if (!Array.isArray(prospects)) {
      throw new Error("saveAllProspects expects an array");
    }

    this._prospects = [...prospects];
    return true;
  }

  updateProspect(updatedProspect) {
    if (!updatedProspect || !updatedProspect.id) {
      throw new Error("updateProspect requires a valid prospect with id");
    }

    const index = this._prospects.findIndex(
      p => p.id === updatedProspect.id
    );

    if (index === -1) {
      throw new Error(`Prospect with id ${updatedProspect.id} not found`);
    }

    this._prospects[index] = {
      ...this._prospects[index],
      ...updatedProspect
    };

    return this._prospects[index];
  }

  addProspect(newProspect) {
    if (!newProspect || !newProspect.id) {
      throw new Error("addProspect requires a prospect with an id");
    }

    const exists = this._prospects.some(p => p.id === newProspect.id);
    if (exists) {
      throw new Error(`Prospect with id ${newProspect.id} already exists`);
    }

    this._prospects.push(newProspect);
    return newProspect;
  }
}

/**
 * Export a singleton instance.
 * There must be ONE source of truth for storage.
 */
const storage = new Storage();
export default storage;

