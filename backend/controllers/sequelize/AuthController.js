import { AuthService } from "../../services/sequelize/AuthService.js";

export class AuthController {
  static async adminLogin(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.adminLogin(username, password);
      res.json(result);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  static async userRegister(req, res) {
    try {
      const result = await AuthService.userRegister(req.body);
      res.json(result);
    } catch (error) {
      console.error('User registration error:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors.map(e => e.message) 
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'User with this email or student ID already exists' 
        });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async userLogin(req, res) {
    try {
      const { studentId, password } = req.body;
      const result = await AuthService.userLogin(studentId, password);
      res.json(result);
    } catch (error) {
      console.error('User login error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  static async validateAdminToken(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.validateAdminToken(token);
      res.json(result);
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({ error: error.message });
    }
  }
} 