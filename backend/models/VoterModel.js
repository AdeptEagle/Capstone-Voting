import { createConnection } from "../config/database.js";

export class VoterModel {
  static async getAll() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT v.*, 
               COUNT(DISTINCT vt.id) as totalVotes
        FROM voters v
        LEFT JOIN votes vt ON v.id = vt.voterId
        GROUP BY v.id
        ORDER BY v.name ASC
      `);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getById(id) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM voters WHERE id = ?", [id]);
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async getByStudentId(studentId) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM voters WHERE studentId = ?", [studentId]);
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async create(voterData) {
    const db = await createConnection();
    try {
      const query = "INSERT INTO voters (name, email, studentId, hasVoted) VALUES (?, ?, ?, ?)";
      const values = [
        voterData.name,
        voterData.email,
        voterData.studentId,
        voterData.hasVoted || false
      ];
      await db.execute(query, values);
      return { message: "Voter created successfully!" };
    } finally {
      await db.release();
    }
  }

  static async update(id, voterData) {
    const db = await createConnection();
    try {
      const query = "UPDATE voters SET name = ?, email = ?, studentId = ?, hasVoted = ? WHERE id = ?";
      const values = [
        voterData.name,
        voterData.email,
        voterData.studentId,
        voterData.hasVoted || false,
        id
      ];
      await db.execute(query, values);
      return { message: "Voter updated successfully!" };
    } finally {
      await db.release();
    }
  }

  static async delete(id) {
    const db = await createConnection();
    try {
      await db.execute("DELETE FROM voters WHERE id = ?", [id]);
      return { message: "Voter deleted successfully!" };
    } finally {
      await db.release();
    }
  }

  static async resetVotingStatus(id) {
    const db = await createConnection();
    try {
      await db.execute("UPDATE voters SET hasVoted = 0 WHERE id = ?", [id]);
      return { message: "Voter status reset successfully!" };
    } finally {
      await db.release();
    }
  }

  static async markAsVoted(id) {
    const db = await createConnection();
    try {
      await db.execute("UPDATE voters SET hasVoted = 1 WHERE id = ?", [id]);
      return { message: "Voter marked as voted successfully!" };
    } finally {
      await db.release();
    }
  }
}