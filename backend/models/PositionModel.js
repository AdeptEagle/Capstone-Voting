import { createConnection } from "../config/database.js";

export class PositionModel {
  static async getAll() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT p.*, 
               COUNT(DISTINCT c.id) as candidateCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        GROUP BY p.id
        ORDER BY p.displayOrder ASC
      `);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getById(id) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM positions WHERE id = ?", [id]);
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async create(positionData) {
    const db = await createConnection();
    try {
      const query = "INSERT INTO positions (id, name, voteLimit, displayOrder) VALUES (?, ?, ?, ?)";
      const values = [
        positionData.id,
        positionData.name,
        positionData.voteLimit || 1,
        positionData.displayOrder || 1
      ];
      await db.execute(query, values);
      return { message: "Position created successfully!" };
    } finally {
      await db.release();
    }
  }

  static async update(id, positionData) {
    const db = await createConnection();
    try {
      const query = "UPDATE positions SET name = ?, voteLimit = ?, displayOrder = ? WHERE id = ?";
      const values = [
        positionData.name,
        positionData.voteLimit || 1,
        positionData.displayOrder || 1,
        id
      ];
      await db.execute(query, values);
      return { message: "Position updated successfully!" };
    } finally {
      await db.release();
    }
  }

  static async delete(id) {
    const db = await createConnection();
    try {
      await db.execute("DELETE FROM positions WHERE id = ?", [id]);
      return { message: "Position deleted successfully!" };
    } finally {
      await db.release();
    }
  }

  static async getPositionsWithCandidates() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.*,
          c.id as candidateId,
          c.name as candidateName,
          c.image as candidateImage,
          c.platform as candidatePlatform,
          c.partyList as candidatePartyList,
          COUNT(v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId
        GROUP BY p.id, c.id
        ORDER BY p.displayOrder ASC, c.name ASC
      `);

      // Transform the flat results into a nested structure
      const positions = [];
      let currentPosition = null;

      for (const row of rows) {
        if (!currentPosition || currentPosition.id !== row.id) {
          currentPosition = {
            id: row.id,
            name: row.name,
            voteLimit: row.voteLimit,
            displayOrder: row.displayOrder,
            candidates: []
          };
          positions.push(currentPosition);
        }

        if (row.candidateId) {
          currentPosition.candidates.push({
            id: row.candidateId,
            name: row.candidateName,
            image: row.candidateImage,
            platform: row.candidatePlatform,
            partyList: row.candidatePartyList,
            voteCount: row.voteCount
          });
        }
      }

      return positions;
    } finally {
      await db.release();
    }
  }
}