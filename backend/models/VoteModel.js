import { createConnection } from "../config/database.js";

export class VoteModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.id, v.voterId, v.candidateId, v.electionId, v.positionId, v.created_at as timestamp, vt.studentId, vt.name as voterName
        FROM votes v
        LEFT JOIN voters vt ON v.voterId = vt.id
        ORDER BY v.created_at DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static async create(voteData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO votes (id, voterId, candidateId, electionId, positionId) VALUES (?, ?, ?, ?, ?)";
      const values = [
        voteData.id,
        voteData.voterId,
        voteData.candidateId,
        voteData.electionId,
        voteData.positionId
      ];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Vote recorded successfully!" });
      });
    });
  }

  static async getByVoterId(voterId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM votes WHERE voterId = ?";
      db.query(query, [voterId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getByElectionId(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM votes WHERE electionId = ?";
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getVoteCountByCandidate(candidateId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as voteCount FROM votes WHERE candidateId = ?";
      db.query(query, [candidateId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0].voteCount);
      });
    });
  }

  static async countVotesByPosition(voterId, electionId, positionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as voteCount FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?";
      db.query(query, [voterId, electionId, positionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0].voteCount);
      });
    });
  }
} 