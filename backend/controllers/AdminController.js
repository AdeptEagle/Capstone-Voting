import { AdminModel } from "../models/AdminModel.js";

export class AdminController {
  static async getAllAdmins(req, res) {
    try {
      const admins = await AdminModel.getAll();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createAdmin(req, res) {
    try {
      const result = await AdminModel.create(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAdmin(req, res) {
    try {
      const adminId = req.params.id;
      const result = await AdminModel.update(adminId, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteAdmin(req, res) {
    try {
      const adminId = req.params.id;
      const result = await AdminModel.delete(adminId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAdminById(req, res) {
    try {
      const adminId = req.params.id;
      const admin = await AdminModel.getById(adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDefaultSuperadmin(req, res) {
    try {
      // Check if superadmin already exists
      const existingAdmin = await AdminModel.getByUsername('Super admin -DevKerbs');
      if (existingAdmin) {
        return res.status(400).json({ 
          error: "Superadmin already exists",
          credentials: {
            username: 'Super admin -DevKerbs',
            password: 'superadmin123',
            email: 'superadmin@votingsystem.com',
            role: 'superadmin'
          }
        });
      }

      // Create default superadmin
      const superadminData = {
        id: 'superadmin-001',
        username: 'Super admin -DevKerbs',
        email: 'superadmin@votingsystem.com',
        password: 'superadmin123',
        role: 'superadmin'
      };

      const result = await AdminModel.create(superadminData);
      res.json({
        ...result,
        credentials: {
          username: 'Super admin -DevKerbs',
          password: 'superadmin123',
          email: 'superadmin@votingsystem.com',
          role: 'superadmin'
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 