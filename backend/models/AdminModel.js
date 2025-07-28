import { createConnection } from "../config/database.js";
import bcrypt from "bcryptjs";

export class AdminModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT id, username, email, role, created_at FROM admins";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async create(adminData) {
    const db = createConnection();
    return new Promise(async (resolve, reject) => {
      try {
        const { id, username, email, password, role } = adminData;
        const hashed = await bcrypt.hash(password, 10);
        
        db.query("INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)", 
          [id, username, email, hashed, role], (err) => {
          db.end();
          if (err) reject(err);
          else resolve({ message: "Admin created successfully!" });
        });
      } catch (error) {
        db.end();
        reject(error);
      }
    });
  }

  static async update(id, adminData) {
    const db = createConnection();
    return new Promise(async (resolve, reject) => {
      try {
        const { username, email, password, role } = adminData;
        
        // Only update password if a new password is provided
        if (password && password.trim() !== '') {
          const hashed = await bcrypt.hash(password, 10);
          db.query("UPDATE admins SET username=?, email=?, password=?, role=? WHERE id=?", 
            [username, email, hashed, role, id], (err) => {
            db.end();
            if (err) reject(err);
            else resolve({ message: "Admin updated successfully!" });
          });
        } else {
          // Update without changing password
          db.query("UPDATE admins SET username=?, email=?, role=? WHERE id=?", 
            [username, email, role, id], (err) => {
            db.end();
            if (err) reject(err);
            else resolve({ message: "Admin updated successfully!" });
          });
        }
      } catch (error) {
        db.end();
        reject(error);
      }
    });
  }

  static async delete(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM admins WHERE id=?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Admin deleted successfully!" });
      });
    });
  }

  static async getByUsername(username) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM admins WHERE username = ?";
      db.query(query, [username], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM admins WHERE id = ?";
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async getByEmail(email) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM admins WHERE email = ?";
      db.query(query, [email], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }

  static async updatePassword(id, hashedPassword) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "UPDATE admins SET password = ? WHERE id = ?";
      db.query(query, [hashedPassword, id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Password updated successfully!" });
      });
    });
  }
} 