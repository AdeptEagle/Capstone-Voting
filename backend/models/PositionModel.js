import { createConnection } from "../config/database.js";

export class PositionModel {
  static async getAll(showAll = false) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      let query;
      
      if (showAll) {
        query = "SELECT * FROM positions ORDER BY displayOrder, name";
      } else {
        query = `
          SELECT p.* 
          FROM positions p
          INNER JOIN election_positions ep ON p.id = ep.positionId
          INNER JOIN elections e ON ep.electionId = e.id
          WHERE e.status = 'active'
          ORDER BY p.displayOrder, p.name
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
        ORDER BY p.displayOrder, p.name
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
      const query = "SELECT * FROM positions ORDER BY displayOrder, name";
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
      const query = "INSERT INTO positions (id, name, voteLimit, displayOrder) VALUES (?, ?, ?, ?)";
      const values = [positionData.id, positionData.name, positionData.voteLimit, positionData.displayOrder || 0];
      db.query(query, values, (err, data) => {
        db.end();
        if (err) {
          // Handle specific MySQL errors
          if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('name')) {
              reject(new Error(`Position name "${positionData.name}" already exists. Please use a different name.`));
            } else if (err.message.includes('id')) {
              reject(new Error(`Position ID "${positionData.id}" already exists. Please use a different ID.`));
            } else {
              reject(new Error('Position already exists with this information.'));
            }
          } else {
            reject(err);
          }
        } else {
          resolve({ message: "Position created successfully!", id: positionData.id });
        }
      });
    });
  }

  static async update(id, positionData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE positions SET name = ?, voteLimit = ?, displayOrder = ? WHERE id = ?";
      const values = [positionData.name, positionData.voteLimit, positionData.displayOrder || 0, id];
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

  static async deleteMultiple(ids) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) {
        db.end();
        return reject(new Error("No positions selected for deletion"));
      }
      
      const placeholders = ids.map(() => '?').join(',');
      const query = `DELETE FROM positions WHERE id IN (${placeholders})`;
      
      db.query(query, ids, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ 
          message: `${data.affectedRows} position(s) deleted successfully!`,
          deletedCount: data.affectedRows
        });
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