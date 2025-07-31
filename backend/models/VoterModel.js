import { createConnection } from "../config/database.js";
import bcrypt from "bcryptjs";

export class VoterModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v 
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        ORDER BY d.name, c.name, v.name
      `;
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
        const { name, email, studentId, password, departmentId, courseId } = voterData;
        
        // If no password provided (admin-created voter), set a default password
        let hashedPassword = null;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        } else {
          // Set default password as student ID for admin-created voters
          hashedPassword = await bcrypt.hash(studentId, 10);
        }
        
        const query = "INSERT INTO voters (name, email, studentId, password, departmentId, courseId) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [name, email, studentId, hashedPassword, departmentId || null, courseId || null];
        
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
      const query = "UPDATE voters SET name = ?, email = ?, studentId = ?, hasVoted = ?, departmentId = ?, courseId = ? WHERE id = ?";
      const values = [
        voterData.name,
        voterData.email,
        voterData.studentId,
        voterData.hasVoted,
        voterData.departmentId || null,
        voterData.courseId || null,
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

  static async deleteMultiple(ids) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) {
        db.end();
        return reject(new Error("No voters selected for deletion"));
      }
      
      const placeholders = ids.map(() => '?').join(',');
      const query = `DELETE FROM voters WHERE id IN (${placeholders})`;
      
      db.query(query, ids, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ 
          message: `${data.affectedRows} voter(s) deleted successfully!`,
          deletedCount: data.affectedRows
        });
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.id = ?
      `;
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
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.studentId = ?
      `;
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

  static async updatePassword(id, hashedPassword) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE voters SET password = ? WHERE id = ?";
      db.query(query, [hashedPassword, id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Password updated successfully!" });
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

  // Get voters by department
  static async getByDepartment(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.departmentId = ?
        ORDER BY c.name, v.name
      `;
      db.query(query, [departmentId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get voters by course
  static async getByCourse(courseId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        WHERE v.courseId = ?
        ORDER BY v.name
      `;
      db.query(query, [courseId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get available voters (not assigned to any department or course)
  static async getAvailable() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.departmentId IS NULL AND v.courseId IS NULL
        ORDER BY v.name
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
} 