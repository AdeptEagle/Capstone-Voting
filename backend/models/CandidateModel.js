import { createConnection } from "../config/database.js";

export class CandidateModel {
  static async getAll(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query = `
        SELECT c.*, p.name as positionName 
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
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
        ORDER BY p.name, c.name
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
        SELECT c.*, p.name as positionName 
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        WHERE c.id IN (
          SELECT ec.candidateId 
          FROM election_candidates ec 
          WHERE ec.electionId = ?
        )
        ORDER BY p.name, c.name
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
      const query = "INSERT INTO candidates (id, name, positionId, photoUrl, description) VALUES (?, ?, ?, ?, ?)";
      const values = [
        candidateData.id,
        candidateData.name,
        candidateData.positionId,
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
      const query = "UPDATE candidates SET name = ?, positionId = ?, photoUrl = ?, description = ? WHERE id = ?";
      const values = [
        candidateData.name,
        candidateData.positionId,
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
        SELECT c.*, p.name as positionName 
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
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
} 