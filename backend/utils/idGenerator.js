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
      // Use compact format: E1, E2, E3, etc. (max 20 chars)
      return `E${result + 1}`;
    } finally {
      db.end();
    }
  }

  static async getNextElectionPositionID() {
    // Use timestamp to ensure uniqueness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `EP${timestamp}${random}`;
  }

  static async getNextElectionCandidateID() {
    // Use timestamp to ensure uniqueness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `EC${timestamp}${random}`;
  }

  static async getNextVoteID() {
    // Use timestamp and random number for uniqueness
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6); // 4 random chars
    return `V${timestamp}-${random}`;
  }

  // Utility method to validate custom ID format
  static isValidCustomID(id, type) {
    const patterns = {
      'election': /^E\d+$/,
      'election-position': /^EP\d+$/,
      'election-candidate': /^EC\d+$/,
      'vote': /^V\d+$/
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