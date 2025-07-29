import { createConnection } from "../config/database.js";

export class ResultsModel {
  static async getActiveElectionResults() {
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
          COALESCE(COUNT(v.id), 0) as voteCount
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        INNER JOIN elections e ON ep.electionId = e.id
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId AND v.electionId = e.id
        WHERE e.status = 'active'
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.displayOrder, p.name, c.displayOrder, c.name, voteCount DESC
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getActiveElectionResults:', err);
          reject(err);
        } else {
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
          WHERE v.electionId IN (
            SELECT id FROM elections 
            WHERE status = 'active'
          )
        `;
      }
      
      query += `
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.displayOrder, p.name, c.displayOrder, c.name, voteCount DESC
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getResults:', err);
          reject(err);
        } else {
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
        ORDER BY p.displayOrder, p.name, c.displayOrder, c.name, voteCount DESC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getResultsForElection:', err);
          reject(err);
        } else {
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

  static async getRealTimeStats() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COALESCE(COUNT(DISTINCT v.id), 0) as totalVotes,
          COALESCE(COUNT(DISTINCT v.voterId), 0) as uniqueVoters,
          COALESCE(COUNT(DISTINCT v.candidateId), 0) as candidatesWithVotes,
          COALESCE(COUNT(DISTINCT p.id), 0) as totalPositions,
          (SELECT COUNT(DISTINCT v2.voterId) FROM votes v2 INNER JOIN elections e2 ON v2.electionId = e2.id WHERE e2.status = 'active') as votersWhoVoted,
          (SELECT COUNT(*) FROM voters) as totalVoters
        FROM votes v
        LEFT JOIN candidates c ON v.candidateId = c.id
        LEFT JOIN positions p ON c.positionId = p.id
        INNER JOIN elections e ON v.electionId = e.id
        WHERE e.status = 'active'
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getRealTimeStats:', err);
          reject(err);
        } else {
          const stats = data[0] || {};
          stats.voterTurnout = stats.totalVoters > 0 ? 
            Math.round((stats.votersWhoVoted / stats.totalVoters) * 100) : 0;
          resolve(stats);
        }
      });
    });
  }

  static async getVoteTimeline() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          DATE_FORMAT(v.created_at, '%H:00') as hour,
          COUNT(*) as voteCount
        FROM votes v
        INNER JOIN elections e ON v.electionId = e.id
        WHERE e.status = 'active'
        AND v.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY DATE_FORMAT(v.created_at, '%H:00')
        ORDER BY hour
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getVoteTimeline:', err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
} 