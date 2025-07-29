import { createConnection } from "../config/database.js";

class IDGenerator {
  static async getNextElectionID() {
    const db = createConnection();
    try {
      const result = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM elections', (err, results) => {
          if (err) reject(err);
          else resolve(results[0].count);
        });
      });
      return `ELEC-${result + 1}`;
    } finally {
      db.end();
    }
  }

  static async getNextElectionPositionID() {
    const db = createConnection();
    try {
      const result = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM election_positions', (err, results) => {
          if (err) reject(err);
          else resolve(results[0].count);
        });
      });
      return `ELEC-POS-${result + 1}`;
    } finally {
      db.end();
    }
  }

  static async getNextElectionCandidateID() {
    const db = createConnection();
    try {
      const result = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM election_candidates', (err, results) => {
          if (err) reject(err);
          else resolve(results[0].count);
        });
      });
      return `ELEC-CAND-${result + 1}`;
    } finally {
      db.end();
    }
  }

  static async getNextVoteID() {
    const db = createConnection();
    try {
      const result = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM votes', (err, results) => {
          if (err) reject(err);
          else resolve(results[0].count);
        });
      });
      return `VOTE-${result + 1}`;
    } finally {
      db.end();
    }
  }

  // Utility method to validate custom ID format
  static isValidCustomID(id, type) {
    const patterns = {
      'election': /^ELEC-\d+$/,
      'election-position': /^ELEC-POS-\d+$/,
      'election-candidate': /^ELEC-CAND-\d+$/,
      'vote': /^VOTE-\d+$/
    };
    
    return patterns[type] && patterns[type].test(id);
  }

  // Extract number from custom ID
  static extractNumber(id) {
    const match = id.match(/\d+$/);
    return match ? parseInt(match[0]) : null;
  }
}

export default IDGenerator; 