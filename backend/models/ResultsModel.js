import { createConnection } from "../config/database.js";

export class ResultsModel {
  static async getActiveElectionResults() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.image,
          c.platform,
          c.partyList,
          COUNT(DISTINCT v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId AND v.electionId = (
          SELECT id FROM elections WHERE status = 'active' ORDER BY created_at DESC LIMIT 1
        )
        GROUP BY p.id, c.id
        ORDER BY p.displayOrder ASC, voteCount DESC, c.name ASC
      `);

      // Transform flat results into nested structure
      const results = [];
      let currentPosition = null;

      for (const row of rows) {
        if (!currentPosition || currentPosition.positionId !== row.positionId) {
          currentPosition = {
            positionId: row.positionId,
            positionName: row.positionName,
            voteLimit: row.voteLimit,
            candidates: []
          };
          results.push(currentPosition);
        }

        if (row.candidateId) {
          currentPosition.candidates.push({
            id: row.candidateId,
            name: row.candidateName,
            image: row.image,
            platform: row.platform,
            partyList: row.partyList,
            voteCount: row.voteCount
          });
        }
      }

      return results;
    } finally {
      await db.release();
    }
  }

  static async getResults(showAll = false) {
    const db = await createConnection();
    try {
      let query = `
        SELECT 
          e.id as electionId,
          e.title as electionTitle,
          e.status as electionStatus,
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.image,
          c.platform,
          c.partyList,
          COUNT(DISTINCT v.id) as voteCount
        FROM elections e
        LEFT JOIN votes v ON e.id = v.electionId
        LEFT JOIN positions p ON v.positionId = p.id
        LEFT JOIN candidates c ON v.candidateId = c.id
      `;

      if (!showAll) {
        query += " WHERE e.status = 'ended'";
      }

      query += `
        GROUP BY e.id, p.id, c.id
        ORDER BY e.created_at DESC, p.displayOrder ASC, voteCount DESC, c.name ASC
      `;

      const [rows] = await db.execute(query);

      // Transform flat results into nested structure
      const results = [];
      let currentElection = null;
      let currentPosition = null;

      for (const row of rows) {
        if (!currentElection || currentElection.electionId !== row.electionId) {
          currentElection = {
            electionId: row.electionId,
            electionTitle: row.electionTitle,
            electionStatus: row.electionStatus,
            positions: []
          };
          results.push(currentElection);
          currentPosition = null;
        }

        if (!currentPosition || currentPosition.positionId !== row.positionId) {
          currentPosition = {
            positionId: row.positionId,
            positionName: row.positionName,
            voteLimit: row.voteLimit,
            candidates: []
          };
          currentElection.positions.push(currentPosition);
        }

        if (row.candidateId) {
          currentPosition.candidates.push({
            id: row.candidateId,
            name: row.candidateName,
            image: row.image,
            platform: row.platform,
            partyList: row.partyList,
            voteCount: row.voteCount
          });
        }
      }

      return results;
    } finally {
      await db.release();
    }
  }

  static async getRealTimeStats() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT
          (SELECT COUNT(*) FROM voters) as totalVoters,
          (SELECT COUNT(DISTINCT voterId) FROM votes WHERE electionId = (
            SELECT id FROM elections WHERE status = 'active' ORDER BY created_at DESC LIMIT 1
          )) as votedCount,
          (SELECT COUNT(*) FROM positions) as totalPositions,
          (SELECT COUNT(*) FROM candidates WHERE isActive = 1) as totalCandidates
      `);
      return rows[0];
    } finally {
      await db.release();
    }
  }

  static async getVoteTimeline() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE_FORMAT(v.created_at, '%Y-%m-%d %H:00:00') as hour,
          COUNT(*) as voteCount
        FROM votes v
        WHERE v.electionId = (
          SELECT id FROM elections WHERE status = 'active' ORDER BY created_at DESC LIMIT 1
        )
        GROUP BY hour
        ORDER BY hour ASC
      `);
      return rows;
    } finally {
      await db.release();
    }
  }
}