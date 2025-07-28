import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, DEFAULTS } from "../config/constants.js";
import { AdminModel } from "../models/AdminModel.js";
import { VoterModel } from "../models/VoterModel.js";

export class AuthService {
  static async adminLogin(username, password) {
    try {
      const admin = await AdminModel.getByUsername(username);
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      // Compare hashed password
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      // Create JWT
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );

      return { token, role: admin.role, id: admin.id };
    } catch (error) {
      throw error;
    }
  }

  static async userRegister(userData) {
    try {
      const { name, email, studentId, password, voterGroupId } = userData;
      
      // Validate required fields
      if (!name || !email || !studentId || !password || !voterGroupId) {
        throw new Error("All fields are required including department/group selection");
      }
      
      // Check if user already exists
      const existingUser = await VoterModel.getByEmail(email) || await VoterModel.getByStudentId(studentId);
      if (existingUser) {
        throw new Error("User with this email or student ID already exists");
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create voter account
      const result = await VoterModel.create({
        name,
        email,
        studentId,
        password: hashedPassword,
        voterGroupId: voterGroupId
      });
      
      // Create JWT token for immediate login
      const token = jwt.sign(
        { id: result.id, email, role: 'user' }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );
      
      return { token, role: 'user', id: result.id, message: "Registration successful" };
    } catch (error) {
      throw error;
    }
  }

  static async userLogin(studentId, password) {
    try {
      const voter = await VoterModel.getByStudentId(studentId);
      if (!voter) {
        throw new Error("Invalid credentials");
      }
      
      // Check if voter has a password (for existing voters without passwords)
      if (!voter.password) {
        throw new Error("Please register first or contact administrator");
      }
      
      // Verify password
      const valid = await bcrypt.compare(password, voter.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }
      
      // Create JWT token
      const token = jwt.sign(
        { id: voter.id, email: voter.email, role: 'user' }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );
      
      return { token, role: 'user', id: voter.id, message: "Login successful" };
    } catch (error) {
      throw error;
    }
  }
} 