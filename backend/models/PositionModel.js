import { createConnection } from "../config/database.js";

export class PositionModel {
  static async getAll(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query;
      
      if (showAll) {
        query = "SELECT * FROM positions ORDER BY name";
      } else {
        query = `
          SELECT p.* 
          FROM positions p
          INNER JOIN election_positions ep ON p.id = ep.positionId
          INNER JOIN elections e ON ep.electionId = e.id
          WHERE e.status = 'active'
          ORDER BY p.name
        `;
      }
      
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getAllForElection(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.* 
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        WHERE ep.electionId = ?
        ORDER BY p.name
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getAllPositions() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM positions ORDER BY name";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async create(positionData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO positions (id, name, voteLimit) VALUES (?, ?, ?)";
      const values = [positionData.id, positionData.name, positionData.voteLimit];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Position created successfully!", id: positionData.id });
      });
    });
  }

  static async update(id, positionData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE positions SET name = ?, voteLimit = ? WHERE id = ?";
      const values = [positionData.name, positionData.voteLimit, id];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Position updated successfully!" });
      });
    });
  }

  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM positions WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Position deleted successfully!" });
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM positions WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }
} 