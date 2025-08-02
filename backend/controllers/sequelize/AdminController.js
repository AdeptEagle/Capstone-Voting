import { Admin } from '../../models/sequelize/index.js';
import { Op } from 'sequelize';

export class AdminController {
  static async getAllAdmins(req, res) {
    try {
      const admins = await Admin.findAll({
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
        order: [['created_at', 'DESC']]
      });
      res.json(admins);
    } catch (error) {
      console.error('Error getting all admins:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createAdmin(req, res) {
    try {
      const admin = await Admin.create(req.body);
      res.status(201).json({ 
        message: "Admin created successfully!",
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors.map(e => e.message) 
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'Username or email already exists' 
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAdmin(req, res) {
    try {
      const adminId = req.params.id;
      const admin = await Admin.findByPk(adminId);
      
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      await admin.update(req.body);
      res.json({ 
        message: "Admin updated successfully!",
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Error updating admin:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors.map(e => e.message) 
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'Username or email already exists' 
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteAdmin(req, res) {
    try {
      const adminId = req.params.id;
      const admin = await Admin.findByPk(adminId);
      
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      await admin.destroy();
      res.json({ message: "Admin deleted successfully!" });
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAdminById(req, res) {
    try {
      const adminId = req.params.id;
      const admin = await Admin.findByPk(adminId, {
        attributes: { exclude: ['password'] }
      });
      
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      
      res.json(admin);
    } catch (error) {
      console.error('Error getting admin by ID:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async searchAdmins(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const admins = await Admin.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } }
          ]
        },
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
        order: [['username', 'ASC']]
      });

      res.json(admins);
    } catch (error) {
      console.error('Error searching admins:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAdminsByRole(req, res) {
    try {
      const { role } = req.params;
      const admins = await Admin.findAll({
        where: { role },
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
        order: [['username', 'ASC']]
      });

      res.json(admins);
    } catch (error) {
      console.error('Error getting admins by role:', error);
      res.status(500).json({ error: error.message });
    }
  }
} 