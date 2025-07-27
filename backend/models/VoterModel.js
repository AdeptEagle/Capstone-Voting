import { createConnection } from "../config/database.js";
import bcrypt from "bcryptjs";

export class VoterModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM voters ORDER BY name";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async create(voterData) {
    const db = createConnection();
    return new Promise(async (resolve, reject) => {
      try {
        const { name, email, studentId, password } = voterData;
        
        // If no password provided (admin-created voter), set a default password
        let hashedPassword = null;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        } else {
          // Set default password as student ID for admin-created voters
          hashedPassword = await bcrypt.hash(studentId, 10);
        }
        
        const query = "INSERT INTO voters (name, email, studentId, password) VALUES (?, ?, ?, ?)";
        const values = [name, email, studentId, hashedPassword];
        
        db.query(query, values, (err, data) => {
          db.end();
          if (err) reject(err);
          else resolve({ 
            message: "Voter created successfully!", 
            id: data.insertId,
            defaultPassword: !password ? studentId : null // Return default password if none was provided
          });
        });
      } catch (error) {
        db.end();
        reject(error);
      }
    });
  }

  static async update(id, voterData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE voters SET name = ?, email = ?, studentId = ?, hasVoted = ? WHERE id = ?";
      const values = [
        voterData.name,
        voterData.email,
        voterData.studentId,
        voterData.hasVoted,
        id
      ];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Voter updated successfully!" });
      });
    });
  }

  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM voters WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Voter deleted successfully!" });
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM voters WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async getByStudentId(studentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM voters WHERE studentId = ?";
      db.query(query, [studentId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async getByEmail(email) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM voters WHERE email = ?";
      db.query(query, [email], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async setVotedStatus(id, hasVoted) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE voters SET hasVoted = ? WHERE id = ?";
      db.query(query, [hasVoted, id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Voter voting status updated successfully!" });
      });
    });
  }

  static async resetVotingStatus(id) {
    return this.setVotedStatus(id, false);
  }
} 