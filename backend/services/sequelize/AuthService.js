import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, DEFAULTS } from "../../config/constants.js";
import { Admin, Voter, Department, Course } from "../../models/sequelize/index.js";

export class AuthService {
  static async adminLogin(username, password) {
    try {
      const admin = await Admin.findByUsername(username);
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      // Compare hashed password using the instance method
      const valid = await admin.validatePassword(password);
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
      const admin = await Admin.findByPk(decoded.id);
      
      if (!admin) {
        return { valid: false, reason: 'Admin not found' };
      }
      
      // Check if username has changed since token was issued
      if (admin.username !== decoded.username) {
        return { valid: false, reason: 'Username changed' };
      }
      
      return { valid: true, admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }};
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
      const existingUser = await Voter.findByEmail(email) || await Voter.findByStudentId(studentId);
      if (existingUser) {
        throw new Error("User with this email or student ID already exists");
      }
      
      // Validate department and course exist
      const department = await Department.findByPk(departmentId);
      if (!department) {
        throw new Error("Department not found");
      }

      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Validate that the course belongs to the selected department
      if (course.departmentId !== departmentId) {
        throw new Error("Selected course does not belong to the selected department");
      }
      
      // Create voter account (password is automatically hashed by Sequelize hooks)
      const voter = await Voter.create({
        name,
        email,
        studentId,
        password,
        departmentId,
        courseId
      });
      
      console.log('Voter created successfully:', voter.id);
      
      // Create JWT token for immediate login
      const token = jwt.sign(
        { id: voter.id, email, name, role: 'user' }, 
        JWT_SECRET, 
        { expiresIn: DEFAULTS.JWT_EXPIRY }
      );
      
      return { token, role: 'user', id: voter.id, message: "Registration successful" };
    } catch (error) {
      console.error('User registration error:', error);
      throw error;
    }
  }

  static async userLogin(studentId, password) {
    try {
      const voter = await Voter.findByStudentId(studentId);
      if (!voter) {
        throw new Error("Invalid credentials");
      }
      
      // Check if voter has a password (for existing voters without passwords)
      if (!voter.password) {
        throw new Error("Please register first or contact administrator");
      }
      
      // Verify password using the instance method
      const valid = await voter.validatePassword(password);
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