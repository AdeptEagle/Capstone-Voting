import { createConnection } from "../config/database.js";

export class ElectionModel {
  static async getAll() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(`
        SELECT e.*, 
               COUNT(DISTINCT v.id) as totalVotes,
               COUNT(DISTINCT v.voterId) as uniqueVoters
        FROM elections e
        LEFT JOIN votes v ON e.id = v.electionId
        GROUP BY e.id
        ORDER BY e.created_at DESC
      `);
      return rows;
    } finally {
      await db.release();
    }
  }

  static async getActive() {
    const db = await createConnection();
    try {
      const [rows] = await db.execute(
        "SELECT * FROM elections WHERE status = 'active' ORDER BY created_at DESC LIMIT 1"
      );
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async getById(id) {
    const db = await createConnection();
    try {
      const [rows] = await db.execute("SELECT * FROM elections WHERE id = ?", [id]);
      return rows[0] || null;
    } finally {
      await db.release();
    }
  }

  static async create(electionData) {
    const db = await createConnection();
    try {
      const query = "INSERT INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        electionData.id,
        electionData.title,
        electionData.description,
        electionData.startTime,
        electionData.endTime,
        electionData.status || 'pending',
        electionData.created_by
      ];
      await db.execute(query, values);
      return { message: "Election created successfully!" };
    } finally {
      await db.release();
    }
  }

  static async update(id, electionData) {
    const db = await createConnection();
    try {
      const query = "UPDATE elections SET title = ?, description = ?, startTime = ?, endTime = ?, status = ? WHERE id = ?";
      const values = [
        electionData.title,
        electionData.description,
        electionData.startTime,
        electionData.endTime,
        electionData.status,
        id
      ];
      await db.execute(query, values);
      return { message: "Election updated successfully!" };
    } finally {
      await db.release();
    }
  }

  static async delete(id) {
    const db = await createConnection();
    try {
      await db.execute("DELETE FROM elections WHERE id = ?", [id]);
      return { message: "Election deleted successfully!" };
    } finally {
      await db.release();
    }
  }

  static async updateStatus(id, status) {
    const db = await createConnection();
    try {
      await db.execute("UPDATE elections SET status = ? WHERE id = ?", [status, id]);
      return { message: "Election status updated successfully!" };
    } finally {
      await db.release();
    }
  }
}