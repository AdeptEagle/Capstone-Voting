import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, DEFAULTS } from "../config/constants.js";
import { AdminModel } from "../models/AdminModel.js";
import { VoterModel } from "../models/VoterModel.js";
import DepartmentModel from "../models/DepartmentModel.js";
import CourseModel from "../models/CourseModel.js";

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

  // New method to validate admin token and check for username changes
  static async validateAdminToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = await AdminModel.getById(decoded.id);
      
      if (!admin) {
        return { valid: false, reason: 'Admin not found' };
      }
      
      // Check if username has changed since token was issued
      if (admin.username !== decoded.username) {
        return { valid: false, reason: 'Username changed' };
      }
      
      return { valid: true, admin };
    } catch (error) {
      return { valid: false, reason: 'Invalid token' };
    }
  }

  static async userRegister(userData) {
    try {
      const { name, email, studentId, password, departmentId, courseId } = userData;
      
      console.log('User registration data:', { name, email, studentId, departmentId, courseId });
      
      // Validate required fields
      if (!name || !email || !studentId || !password || !departmentId || !courseId) {
        throw new Error("All fields are required including department and course selection");
      }
      
      // Validate student ID format: YYYY-NNNNN
      const idPattern = /^\d{4}-\d{5}$/;
      if (!idPattern.test(studentId)) {
        throw new Error("Student ID must be in the format YYYY-NNNNN (e.g., 2024-00001)");
      }
      
      // Check if user already exists
      const existingUser = await VoterModel.getByEmail(email) || await VoterModel.getByStudentId(studentId);
      if (existingUser) {
        throw new Error("User with this email or student ID already exists");
      }
      
      // Validate department and course exist
      const department = await DepartmentModel.getById(departmentId);
      if (!department) {
        throw new Error("Department not found");
      }

      const course = await CourseModel.getById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Validate that the course belongs to the selected department
      if (String(course.departmentId) !== String(departmentId)) {
        throw new Error(`Selected course (${course.name}) does not belong to the selected department. Course department: ${course.departmentId}, Selected department: ${departmentId}`);
      }
      
      // Create voter account (password is already hashed in VoterModel.create)
      const result = await VoterModel.create({
        name,
        email,
        studentId,
        password, // VoterModel.create will hash this
        departmentId,
        courseId
      });
      
      console.log('Voter created successfully:', result);
      
      // Create JWT token for immediate login
      const token = jwt.sign(
        { id: result.id, email, name, role: 'user' }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );
      
      return { token, role: 'user', id: result.id, message: "Registration successful" };
    } catch (error) {
      console.error('User registration error:', error);
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
        { id: voter.id, email: voter.email, name: voter.name, role: 'user' }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );
      
      return { token, role: 'user', id: voter.id, message: "Login successful" };
    } catch (error) {
      throw error;
    }
  }
} 