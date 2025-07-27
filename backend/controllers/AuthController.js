import { AuthService } from "../services/AuthService.js";

export class AuthController {
  static async adminLogin(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.adminLogin(username, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async userRegister(req, res) {
    try {
      const result = await AuthService.userRegister(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async userLogin(req, res) {
    try {
      const { studentId, password } = req.body;
      const result = await AuthService.userLogin(studentId, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
} 