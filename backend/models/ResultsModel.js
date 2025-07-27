import { createConnection } from "../config/database.js";

export class ResultsModel {
  static async getResults(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.photoUrl,
          COUNT(v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId
      `;
      
      if (!showAll) {
        query += `
          WHERE p.id IN (
            SELECT ep.positionId 
            FROM election_positions ep 
            INNER JOIN elections e ON ep.electionId = e.id 
            WHERE e.status = 'active'
          )
        `;
      }
      
      query += `
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.name, voteCount DESC
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const resultsWithPhotoUrl = data.map(result => {
            if (result.photoUrl && !result.photoUrl.startsWith('http')) {
              result.photoUrl = `http://localhost:3000/uploads/${result.photoUrl}`;
            }
            return result;
          });
          resolve(resultsWithPhotoUrl);
        }
      });
    });
  }

  static async getResultsForElection(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.photoUrl,
          COUNT(v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId
        WHERE p.id IN (
          SELECT ep.positionId 
          FROM election_positions ep 
          WHERE ep.electionId = ?
        )
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.name, voteCount DESC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else {
          // Convert photoUrl to full URL if it's a filename
          const resultsWithPhotoUrl = data.map(result => {
            if (result.photoUrl && !result.photoUrl.startsWith('http')) {
              result.photoUrl = `http://localhost:3000/uploads/${result.photoUrl}`;
            }
            return result;
          });
          resolve(resultsWithPhotoUrl);
        }
      });
    });
  }
} 