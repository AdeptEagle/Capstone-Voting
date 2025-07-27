import { createConnection } from "../config/database.js";
import crypto from "crypto";

export class ElectionModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername,
        (SELECT COUNT(*) FROM election_positions ep WHERE ep.electionId = e.id) as positionCount
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        ORDER BY e.created_at DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getActive() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.status = 'active' 
        ORDER BY e.created_at DESC
        LIMIT 1
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length > 0 ? data[0] : null);
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.id = ?
      `;
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length === 0 ? null : data[0]);
      });
    });
  }

  static async hasActiveElection() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as count FROM elections WHERE status != 'ended'";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0].count > 0);
      });
    });
  }

  static async getCurrentElection() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM elections WHERE status != 'ended' ORDER BY created_at DESC LIMIT 1";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length > 0 ? data[0] : null);
      });
    });
  }

  static async getElectionHistory() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername,
        (SELECT COUNT(*) FROM election_positions ep WHERE ep.electionId = e.id) as positionCount,
        (SELECT COUNT(*) FROM votes v WHERE v.electionId = e.id) as totalVotes
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.status = 'ended'
        ORDER BY e.endTime DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async create(electionData) {
    const db = createConnection();
    return new Promise(async (resolve, reject) => {
      try {
        // Check if there's already an active election in the system
        const hasActive = await this.hasActiveElection();
        if (hasActive) {
          const currentElection = await this.getCurrentElection();
          db.end();
          return reject(new Error(`Cannot create a new election. There is already an election "${currentElection.title}" in the system. You must end or delete the existing election first to create a new one.`));
        }

        const { title, description, startTime, endTime, positionIds, id, createdBy } = electionData;

        // Convert dates to MySQL datetime format
        const mysqlStartTime = new Date(startTime).toISOString().slice(0, 19).replace('T', ' ');
        const mysqlEndTime = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');

        db.query("INSERT INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (?, ?, ?, ?, ?, 'pending', ?)",
          [id, title, description, mysqlStartTime, mysqlEndTime, createdBy], (err, result) => {
          if (err) {
            db.end();
            return reject(err);
          }

          // Add positions to election
          if (positionIds && positionIds.length > 0) {
            const positionValues = positionIds.map(posId => [crypto.randomUUID(), id, posId]);
            const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
            db.query(positionQuery, [positionValues], (err) => {
              db.end();
              if (err) reject(err);
              else resolve({ message: "Election created successfully!", id });
            });
          } else {
            db.end();
            resolve({ message: "Election created successfully!", id });
          }
        });
      } catch (error) {
        db.end();
        reject(error);
      }
    });
  }

  static async update(id, electionData) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const { title, description, startTime, endTime, status, positionIds } = electionData;

      // Convert dates to MySQL datetime format
      const mysqlStartTime = new Date(startTime).toISOString().slice(0, 19).replace('T', ' ');
      const mysqlEndTime = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');

      db.query("UPDATE elections SET title = ?, description = ?, startTime = ?, endTime = ?, status = ? WHERE id = ?",
        [title, description, mysqlStartTime, mysqlEndTime, status, id], (err) => {
        if (err) {
          db.end();
          return reject(err);
        }

        // Update positions if provided
        if (positionIds !== undefined) {
          // Remove existing positions
          db.query("DELETE FROM election_positions WHERE electionId = ?", [id], (err) => {
            if (err) {
              db.end();
              return reject(err);
            }

            // Add new positions
            if (positionIds.length > 0) {
              const positionValues = positionIds.map(posId => [crypto.randomUUID(), id, posId]);
              const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
              db.query(positionQuery, [positionValues], (err) => {
                db.end();
                if (err) reject(err);
                else resolve({ message: "Election updated successfully!" });
              });
            } else {
              db.end();
              resolve({ message: "Election updated successfully!" });
            }
          });
        } else {
          db.end();
          resolve({ message: "Election updated successfully!" });
        }
      });
    });
  }

  static async startElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'active' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election started successfully!" });
      });
    });
  }

  static async pauseElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'paused' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election paused successfully!" });
      });
    });
  }

  static async stopElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'stopped' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election stopped successfully!" });
      });
    });
  }

  static async resumeElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'active' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election resumed successfully!" });
      });
    });
  }

  static async endElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      db.query("UPDATE elections SET status = 'ended', endTime = ? WHERE id = ?", [endTime, id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election ended successfully and saved to history!" });
      });
    });
  }

  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM elections WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election deleted successfully!" });
      });
    });
  }

  static async getPositions(electionId) {
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
} 