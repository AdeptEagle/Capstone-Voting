import { createConnection } from '../config/database.js';

// Simple UUID generator function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

class DepartmentModel {
  // Get all departments
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.*, a.username as createdByUsername,
               COUNT(DISTINCT c.id) as courseCount,
               COUNT(DISTINCT v.id) as voterCount
        FROM departments d
        LEFT JOIN admins a ON d.created_by = a.id
        LEFT JOIN courses c ON d.id = c.departmentId
        LEFT JOIN voters v ON d.id = v.departmentId
        GROUP BY d.id
        ORDER BY d.name
      `;
      db.query(query, (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get department by ID
  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.*, a.username as createdByUsername
        FROM departments d
        LEFT JOIN admins a ON d.created_by = a.id
        WHERE d.id = ?
      `;
      db.query(query, [id], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  // Create a new department
  static async create(departmentData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const id = departmentData.id || generateUUID();
      const query = `
        INSERT INTO departments (id, name, created_by)
        VALUES (?, ?, ?)
      `;
      db.query(query, [
        id,
        departmentData.name,
        departmentData.created_by
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id, ...departmentData });
      });
    });
  }

  // Update a department
  static async update(id, departmentData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE departments 
        SET name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.query(query, [
        departmentData.name,
        id
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id, ...departmentData });
      });
    });
  }

  // Delete a department
  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM departments WHERE id = ?`;
      db.query(query, [id], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Get courses in a department
  static async getCourses(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, a.username as createdByUsername,
               COUNT(DISTINCT v.id) as voterCount
        FROM courses c
        LEFT JOIN admins a ON c.created_by = a.id
        LEFT JOIN voters v ON c.id = v.courseId
        WHERE c.departmentId = ?
        GROUP BY c.id
        ORDER BY c.name
      `;
      db.query(query, [departmentId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get voters in a department
  static async getVoters(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, c.name as courseName
        FROM voters v
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.departmentId = ?
        ORDER BY v.name
      `;
      db.query(query, [departmentId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get candidates in a department
  static async getCandidates(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, co.name as courseName
        FROM candidates c
        LEFT JOIN positions p ON c.positionId = p.id
        LEFT JOIN courses co ON c.courseId = co.id
        WHERE c.departmentId = ?
        ORDER BY c.displayOrder, c.name
      `;
      db.query(query, [departmentId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

export default DepartmentModel; 