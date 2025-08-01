import { createConnection } from "../config/database.js";

// Helper function to format photo URLs consistently
const formatPhotoUrl = (photoUrl) => {
  if (!photoUrl || photoUrl.trim() === '') {
    return null;
  }
  
  // If it's already a full URL (http/https) or data URL, return as is
  if (photoUrl.startsWith('http') || photoUrl.startsWith('data:')) {
    return photoUrl;
  }
  
  // Otherwise, construct full URL using environment variable or fallback
  const baseUrl = process.env.BACKEND_URL || process.env.RAILWAY_PUBLIC_DOMAIN 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
    : 'https://backend-production-219d.up.railway.app';
    
  return `${baseUrl}/uploads/${photoUrl}`;
};

export class CandidateModel {
  static async getAll(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query = `
        SELECT c.*, p.name as positionName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
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
          // Format photo URLs consistently
          const candidatesWithPhotoUrl = data.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  static async getAllForElection(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
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
          // Format photo URLs consistently
          const candidatesWithPhotoUrl = data.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  static async create(candidateData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      // Generate UUID if no id provided
      const id = candidateData.id || 'candidate-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      const query = "INSERT INTO candidates (id, name, positionId, departmentId, courseId, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        id,
        candidateData.name,
        candidateData.positionId,
        candidateData.departmentId || null,
        candidateData.courseId || null,
        candidateData.photoUrl || null,
        candidateData.description || null
      ];
      
      db.query(query, values, (err, data) => {
        db.end();
        if (err) {
          console.error('Error creating candidate:', err);
          reject(err);
        } else {
          resolve({ 
            message: "Candidate created successfully!",
            id: id,
            candidate: { ...candidateData, id }
          });
        }
      });
    });
  }

  static async update(id, candidateData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE candidates SET name = ?, positionId = ?, departmentId = ?, courseId = ?, photoUrl = ?, description = ? WHERE id = ?";
      const values = [
        candidateData.name,
        candidateData.positionId,
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

  static async deleteMultiple(ids) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) {
        db.end();
        return reject(new Error("No candidates selected for deletion"));
      }
      
      const placeholders = ids.map(() => '?').join(',');
      const query = `DELETE FROM candidates WHERE id IN (${placeholders})`;
      
      db.query(query, ids, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ 
          message: `${data.affectedRows} candidate(s) deleted successfully!`,
          deletedCount: data.affectedRows
        });
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name as positionName,
               d.name as departmentName, co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
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
            const formattedCandidate = {
              ...candidate,
              photoUrl: formatPhotoUrl(candidate.photoUrl)
            };
            resolve(formattedCandidate);
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
        SELECT c.*, p.name as positionName,
               co.name as courseName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN courses co ON c.courseId = co.id
        WHERE c.departmentId = ?
        ORDER BY co.name, p.name, c.name
      `;
      db.query(query, [departmentId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Format photo URLs consistently
          const candidatesWithPhotoUrl = data.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
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
        SELECT c.*, p.name as positionName,
               d.name as departmentName
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        LEFT JOIN departments d ON c.departmentId = d.id
        WHERE c.courseId = ?
        ORDER BY d.name, p.name, c.name
      `;
      db.query(query, [courseId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Format photo URLs consistently
          const candidatesWithPhotoUrl = data.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }
} 