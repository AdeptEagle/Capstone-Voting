import { createConnection } from '../config/database.js';

class CourseModel {
  // Get all courses
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, d.name as departmentName, a.username as createdByUsername,
               COUNT(DISTINCT v.id) as voterCount
        FROM courses c
        LEFT JOIN departments d ON c.departmentId = d.id
        LEFT JOIN admins a ON c.created_by = a.id
        LEFT JOIN voters v ON c.id = v.courseId
        GROUP BY c.id
        ORDER BY d.name, c.name
      `;
      db.query(query, (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get course by ID
  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, d.name as departmentName, a.username as createdByUsername
        FROM courses c
        LEFT JOIN departments d ON c.departmentId = d.id
        LEFT JOIN admins a ON c.created_by = a.id
        WHERE c.id = ?
      `;
      db.query(query, [id], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  // Create a new course
  static async create(courseData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      // Use the provided course ID or generate a simple one
      const courseId = courseData.id || `COURSE-${Date.now()}`;
      
      const query = `
        INSERT INTO courses (id, name, departmentId, created_by)
        VALUES (?, ?, ?, ?)
      `;
      db.query(query, [
        courseId,
        courseData.name,
        courseData.departmentId,
        courseData.created_by
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id: courseId, ...courseData });
      });
    });
  }

  // Update a course
  static async update(id, courseData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE courses 
        SET name = ?, departmentId = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.query(query, [
        courseData.name,
        courseData.departmentId,
        id
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id, ...courseData });
      });
    });
  }

  // Delete a course
  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM courses WHERE id = ?`;
      db.query(query, [id], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Get courses by department
  static async getByDepartment(departmentId) {
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

  // Get voters in a course
  static async getVoters(courseId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        WHERE v.courseId = ?
        ORDER BY v.name
      `;
      db.query(query, [courseId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get candidates in a course
  static async getCandidates(courseId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, d.name as departmentName
        FROM candidates c
        LEFT JOIN positions p ON c.positionId = p.id
        LEFT JOIN departments d ON c.departmentId = d.id
        WHERE c.courseId = ?
        ORDER BY c.name
      `;
      db.query(query, [courseId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

export default CourseModel; 