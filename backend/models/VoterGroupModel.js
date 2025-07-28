import { createConnection } from '../config/database.js';

// Simple UUID generator function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

class VoterGroupModel {
  // Get all voter groups
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, a.username as createdByUsername,
               d.name as departmentName, c.name as courseName,
               COUNT(v.id) as memberCount
        FROM voter_groups vg
        LEFT JOIN admins a ON vg.created_by = a.id
        LEFT JOIN departments d ON vg.departmentId = d.id
        LEFT JOIN courses c ON vg.courseId = c.id
        LEFT JOIN voters v ON vg.id = v.voterGroupId
        GROUP BY vg.id
        ORDER BY d.displayOrder, d.name, c.displayOrder, c.name, vg.name
      `;
      db.query(query, (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get voter group by ID
  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, a.username as createdByUsername,
               d.name as departmentName, c.name as courseName
        FROM voter_groups vg
        LEFT JOIN admins a ON vg.created_by = a.id
        LEFT JOIN departments d ON vg.departmentId = d.id
        LEFT JOIN courses c ON vg.courseId = c.id
        WHERE vg.id = ?
      `;
      db.query(query, [id], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  // Create a new voter group
  static async create(voterGroupData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const id = voterGroupData.id || generateUUID();
      const query = `
        INSERT INTO voter_groups (id, name, description, type, departmentId, courseId, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(query, [
        id,
        voterGroupData.name,
        voterGroupData.description,
        voterGroupData.type,
        voterGroupData.departmentId || null,
        voterGroupData.courseId || null,
        voterGroupData.created_by
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id, ...voterGroupData });
      });
    });
  }

  // Update a voter group
  static async update(id, voterGroupData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE voter_groups 
        SET name = ?, description = ?, type = ?, departmentId = ?, courseId = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.query(query, [
        voterGroupData.name,
        voterGroupData.description,
        voterGroupData.type,
        voterGroupData.departmentId || null,
        voterGroupData.courseId || null,
        id
      ], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve({ id, ...voterGroupData });
      });
    });
  }

  // Delete a voter group
  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM voter_groups WHERE id = ?`;
      db.query(query, [id], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Get members of a voter group
  static async getMembers(voterGroupId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.voterGroupId = ?
        ORDER BY v.name
      `;
      db.query(query, [voterGroupId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Add member to voter group
  static async addMember(voterGroupId, voterId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE voters 
        SET voterGroupId = ?
        WHERE id = ?
      `;
      db.query(query, [voterGroupId, voterId], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Remove member from voter group
  static async removeMember(voterGroupId, voterId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE voters 
        SET voterGroupId = NULL
        WHERE id = ? AND voterGroupId = ?
      `;
      db.query(query, [voterId, voterGroupId], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Get voter groups by type
  static async getByType(type) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, a.username as createdByUsername,
               d.name as departmentName, c.name as courseName,
               COUNT(v.id) as memberCount
        FROM voter_groups vg
        LEFT JOIN admins a ON vg.created_by = a.id
        LEFT JOIN departments d ON vg.departmentId = d.id
        LEFT JOIN courses c ON vg.courseId = c.id
        LEFT JOIN voters v ON vg.id = v.voterGroupId
        WHERE vg.type = ?
        GROUP BY vg.id
        ORDER BY d.displayOrder, d.name, c.displayOrder, c.name, vg.name
      `;
      db.query(query, [type], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get voter groups by department
  static async getByDepartment(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, a.username as createdByUsername,
               c.name as courseName,
               COUNT(v.id) as memberCount
        FROM voter_groups vg
        LEFT JOIN admins a ON vg.created_by = a.id
        LEFT JOIN courses c ON vg.courseId = c.id
        LEFT JOIN voters v ON vg.id = v.voterGroupId
        WHERE vg.departmentId = ?
        GROUP BY vg.id
        ORDER BY c.displayOrder, c.name, vg.name
      `;
      db.query(query, [departmentId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get voter groups by course
  static async getByCourse(courseId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, a.username as createdByUsername,
               COUNT(v.id) as memberCount
        FROM voter_groups vg
        LEFT JOIN admins a ON vg.created_by = a.id
        LEFT JOIN voters v ON vg.id = v.voterGroupId
        WHERE vg.courseId = ?
        GROUP BY vg.id
        ORDER BY vg.name
      `;
      db.query(query, [courseId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get voter groups that a voter belongs to
  static async getVoterGroups(voterId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT vg.*, d.name as departmentName, c.name as courseName
        FROM voter_groups vg
        INNER JOIN voters v ON vg.id = v.voterGroupId
        LEFT JOIN departments d ON vg.departmentId = d.id
        LEFT JOIN courses c ON vg.courseId = c.id
        WHERE v.id = ?
        ORDER BY vg.name
      `;
      db.query(query, [voterId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get available voters (not in any group)
  static async getAvailableVoters() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT v.*, d.name as departmentName, c.name as courseName
        FROM voters v
        LEFT JOIN departments d ON v.departmentId = d.id
        LEFT JOIN courses c ON v.courseId = c.id
        WHERE v.voterGroupId IS NULL
        ORDER BY v.name
      `;
      db.query(query, (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

export default VoterGroupModel; 