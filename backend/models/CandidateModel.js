import { createConnection } from "../config/database.js";

export class CandidateModel {
  static async getAll(showAll = false) {
    const db = await createConnection();
    try {
      let query = `
        SELECT c.*,
               p.name as positionName,
               p.voteLimit as positionVoteLimit,
               COUNT(DISTINCT v.id) as voteCount
        FROM candidates c
        LEFT JOIN positions p ON c.positionId = p.id
        LEFT JOIN votes v ON c.id = v.candidateId
      `;

      if (!showAll) {
        query += " WHERE c.isActive = 1";
      }

      query += " GROUP BY c.id ORDER BY p.displayOrder ASC, c.name ASC";

      const [rows] = await db.execute(query);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getById(id) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT c.*,
               p.name as positionName,
               p.voteLimit as positionVoteLimit,
               COUNT(DISTINCT v.id) as voteCount
        FROM candidates c
        LEFT JOIN positions p ON c.positionId = p.id
        LEFT JOIN votes v ON c.id = v.candidateId
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async create(candidateData) {
    const db = await createConnection();
    try {
      const query = "INSERT INTO candidates (id, name, positionId, image, platform, partyList, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        candidateData.id,
        candidateData.name,
        candidateData.positionId,
        candidateData.image || null,
        candidateData.platform || null,
        candidateData.partyList || null,
        candidateData.isActive || true
      ];
      await db.execute(query, values);
      return { message: "Candidate created successfully!" };
    } finally {
      await db.release();
    }
  }

  static async update(id, candidateData) {
    const db = await createConnection();
    try {
      const query = "UPDATE candidates SET name = ?, positionId = ?, image = ?, platform = ?, partyList = ?, isActive = ? WHERE id = ?";
      const values = [
        candidateData.name,
        candidateData.positionId,
        candidateData.image,
        candidateData.platform,
        candidateData.partyList,
        candidateData.isActive,
        id
      ];
      await db.execute(query, values);
      return { message: "Candidate updated successfully!" };
    } finally {
      await db.release();
    }
  }

  static async delete(id) {
    const db = await createConnection();
    try {
      await db.execute("DELETE FROM candidates WHERE id = ?", [id]);
      return { message: "Candidate deleted successfully!" };
    } finally {
      await db.release();
    }
  }

  static async getByPosition(positionId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT c.*,
               COUNT(DISTINCT v.id) as voteCount
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidateId
        WHERE c.positionId = ?
        GROUP BY c.id
        ORDER BY c.name ASC
      `, [positionId]);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async toggleActive(id, isActive) {
    const db = await createConnection();
    try {
      await db.execute("UPDATE candidates SET isActive = ? WHERE id = ?", [isActive, id]);
      return { message: `Candidate ${isActive ? 'activated' : 'deactivated'} successfully!` };
    } finally {
      await db.release();
    }
  }
}