import { createConnection } from "../config/database.js";

export class VoteModel {
  static async getAll() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT v.id, v.voterId, v.candidateId, v.electionId, v.positionId, v.created_at as timestamp, vt.studentId, vt.name as voterName
        FROM votes v
        LEFT JOIN voters vt ON v.voterId = vt.id
        ORDER BY v.created_at DESC
      `);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async create(voteData) {
    const db = await createConnection();
    try {
      const query = "INSERT INTO votes (id, voterId, candidateId, electionId, positionId) VALUES (?, ?, ?, ?, ?)";
      const values = [
        voteData.id,
        voteData.voterId,
        voteData.candidateId,
        voteData.electionId,
        voteData.positionId
      ];
      await db.execute(query, values);
      return { message: "Vote recorded successfully!" };
    } finally {
      await db.release();
    }
  }

  static async getByVoterId(voterId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM votes WHERE voterId = ?", [voterId]);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getByElectionId(electionId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM votes WHERE electionId = ?", [electionId]);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getVoteCountByCandidate(candidateId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT COUNT(*) as voteCount FROM votes WHERE candidateId = ?", [candidateId]);
      return rows[0].voteCount;
    } finally {
      await db.release();
    }
  }

  static async countVotesByPosition(voterId, electionId, positionId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(
        "SELECT COUNT(*) as voteCount FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?",
        [voterId, electionId, positionId]
      );
      return rows[0].voteCount;
    } finally {
      await db.release();
    }
  }
}