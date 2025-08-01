import { createConnection } from "../config/database.js";

// Simple UUID generator function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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

export class ElectionAssignmentModel {
  // Get all positions assigned to a specific election
  static async getElectionPositions(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, ep.id as assignmentId
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        WHERE ep.electionId = ?
        ORDER BY p.displayOrder, p.name
      `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get all candidates assigned to a specific election
  static async getElectionCandidates(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
             const query = `
         SELECT c.*, ec.id as assignmentId, p.name as positionName
         FROM candidates c
         INNER JOIN election_candidates ec ON c.id = ec.candidateId
         INNER JOIN positions p ON c.positionId = p.id
         WHERE ec.electionId = ?
         ORDER BY p.displayOrder, p.name, c.name
       `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else {
                    // Format photo URLs consistently
          const formattedResults = results.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(formattedResults);
        }
      });
    });
  }

  // Get all positions NOT assigned to a specific election
  static async getUnassignedPositions(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*
        FROM positions p
        WHERE p.id NOT IN (
          SELECT ep.positionId 
          FROM election_positions ep 
          WHERE ep.electionId = ?
        )
        ORDER BY p.displayOrder, p.name
      `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get all candidates NOT assigned to a specific election
  static async getUnassignedCandidates(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
             const query = `
         SELECT c.*, p.name as positionName
         FROM candidates c
         INNER JOIN positions p ON c.positionId = p.id
         WHERE c.id NOT IN (
           SELECT ec.candidateId 
           FROM election_candidates ec 
           WHERE ec.electionId = ?
         )
         ORDER BY p.displayOrder, p.name, c.name
       `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else {
                     // Format photo URLs for candidates
           const formattedResults = results.map(candidate => {
                         candidate.photoUrl = formatPhotoUrl(candidate.photoUrl);
             return candidate;
           });
          resolve(formattedResults);
        }
      });
    });
  }

  // Assign a position to an election
  static async assignPositionToElection(electionId, positionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const assignmentId = generateUUID();
      const query = `
        INSERT INTO election_positions (id, electionId, positionId)
        VALUES (?, ?, ?)
      `;
      db.query(query, [assignmentId, electionId, positionId], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Assign a candidate to an election
  static async assignCandidateToElection(electionId, candidateId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const assignmentId = generateUUID();
      const query = `
        INSERT INTO election_candidates (id, electionId, candidateId)
        VALUES (?, ?, ?)
      `;
      console.log('Executing query:', query);
      console.log('Query parameters:', [assignmentId, electionId, candidateId]);
      db.query(query, [assignmentId, electionId, candidateId], (err, result) => {
        db.end();
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          console.log('Query successful:', result);
          resolve(result);
        }
      });
    });
  }

  // Remove a position from an election
  static async removePositionFromElection(electionId, positionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM election_positions 
        WHERE electionId = ? AND positionId = ?
      `;
      db.query(query, [electionId, positionId], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Remove a candidate from an election
  static async removeCandidateFromElection(electionId, candidateId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM election_candidates 
        WHERE electionId = ? AND candidateId = ?
      `;
      db.query(query, [electionId, candidateId], (err, result) => {
        db.end();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Get assignment status for positions in an election
  static async getPositionAssignmentStatus(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*,
          CASE WHEN ep.positionId IS NOT NULL THEN 1 ELSE 0 END as isAssigned
        FROM positions p
        LEFT JOIN election_positions ep ON p.id = ep.positionId AND ep.electionId = ?
        ORDER BY p.displayOrder, p.name
      `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Get assignment status for candidates in an election
  static async getCandidateAssignmentStatus(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.*,
          p.name as positionName,
          CASE WHEN ec.candidateId IS NOT NULL THEN 1 ELSE 0 END as isAssigned
        FROM candidates c
        INNER JOIN positions p ON c.positionId = p.id
        LEFT JOIN election_candidates ec ON c.id = ec.candidateId AND ec.electionId = ?
        ORDER BY p.displayOrder, p.name, c.name
      `;
      db.query(query, [electionId], (err, results) => {
        db.end();
        if (err) reject(err);
        else {
          // Format photo URLs consistently
          const formattedResults = results.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(formattedResults);
        }
      });
    });
  }
}

export default ElectionAssignmentModel;