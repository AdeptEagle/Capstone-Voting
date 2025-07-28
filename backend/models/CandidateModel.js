import { createConnection } from "../config/database.js";

export class CandidateModel {
  static async getAll(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query = `
        SELECT c.*, p.name as positionName, vg.name as voterGroupName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN voter_groups vg ON c.voterGroupId = vg.id 
        LEFT JOIN departments d ON c.departmentId = d.id
        LEFT JOIN courses co ON c.courseId = co.id
      `;
      
      if (!showAll) {
        query += `
          WHERE c.id IN (
            SELECT ec.candidateId 
            FROM election_candidates ec 
            INNER JOIN elections e ON ec.electionId = e.id 
            WHERE e.status = 'active'
          )
        `;
      }
      
      query += `
        ORDER BY d.name, co.name, p.name, c.name
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const candidatesWithPhotoUrl = data.map(candidate => {
            if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
              candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
            }
            return candidate;
          });
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  static async getAllForElection(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, vg.name as voterGroupName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN voter_groups vg ON c.voterGroupId = vg.id 
        LEFT JOIN departments d ON c.departmentId = d.id
        LEFT JOIN courses co ON c.courseId = co.id
        WHERE c.id IN (
          SELECT ec.candidateId 
          FROM election_candidates ec 
          WHERE ec.electionId = ?
        )
        ORDER BY d.name, co.name, p.name, c.name
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const candidatesWithPhotoUrl = data.map(candidate => {
            if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
              candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
            }
            return candidate;
          });
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  static async create(candidateData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO candidates (id, name, positionId, voterGroupId, departmentId, courseId, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        candidateData.id,
        candidateData.name,
        candidateData.positionId,
        candidateData.voterGroupId || null,
        candidateData.departmentId || null,
        candidateData.courseId || null,
        candidateData.photoUrl,
        candidateData.description || null
      ];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Candidate created successfully!", id: candidateData.id });
      });
    });
  }

  static async update(id, candidateData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE candidates SET name = ?, positionId = ?, voterGroupId = ?, departmentId = ?, courseId = ?, photoUrl = ?, description = ? WHERE id = ?";
      const values = [
        candidateData.name,
        candidateData.positionId,
        candidateData.voterGroupId || null,
        candidateData.departmentId || null,
        candidateData.courseId || null,
        candidateData.photoUrl,
        candidateData.description || null,
        id
      ];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Candidate updated successfully!" });
      });
    });
  }

  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM candidates WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Candidate deleted successfully!" });
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, vg.name as voterGroupName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN voter_groups vg ON c.voterGroupId = vg.id 
        LEFT JOIN departments d ON c.departmentId = d.id
        LEFT JOIN courses co ON c.courseId = co.id
        WHERE c.id = ?
      `;
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          if (data.length === 0) resolve(null);
          else {
            const candidate = data[0];
            if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
              candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
            }
            resolve(candidate);
          }
        }
      });
    });
  }

  // Get candidates by department
  static async getByDepartment(departmentId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, vg.name as voterGroupName,
               co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN voter_groups vg ON c.voterGroupId = vg.id 
        LEFT JOIN courses co ON c.courseId = co.id
        WHERE c.departmentId = ?
        ORDER BY co.name, p.name, c.name
      `;
      db.query(query, [departmentId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const candidatesWithPhotoUrl = data.map(candidate => {
            if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
              candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
            }
            return candidate;
          });
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  // Get candidates by course
  static async getByCourse(courseId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName, vg.name as voterGroupName,
               d.name as departmentName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN voter_groups vg ON c.voterGroupId = vg.id 
        LEFT JOIN departments d ON c.departmentId = d.id
        WHERE c.courseId = ?
        ORDER BY p.name, c.name
      `;
      db.query(query, [courseId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const candidatesWithPhotoUrl = data.map(candidate => {
            if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
              candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
            }
            return candidate;
          });
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }
} 