import DepartmentModel from '../models/DepartmentModel.js';
import CourseModel from '../models/CourseModel.js';

class DepartmentController {
  // Get all departments
  static async getAll(req, res) {
    try {
      const departments = await DepartmentModel.getAll();
      res.json(departments);
    } catch (error) {
      console.error('Error getting departments:', error);
      res.status(500).json({ error: 'Failed to get departments' });
    }
  }

  // Get department by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const department = await DepartmentModel.getById(id);
      
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      res.json(department);
    } catch (error) {
      console.error('Error getting department:', error);
      res.status(500).json({ error: 'Failed to get department' });
    }
  }

  // Create a new department
  static async create(req, res) {
    try {
      const departmentData = {
        ...req.body,
        created_by: req.user.id
      };
      
      const department = await DepartmentModel.create(departmentData);
      res.status(201).json(department);
    } catch (error) {
      console.error('Error creating department:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Department name already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create department' });
      }
    }
  }

  // Update a department
  static async update(req, res) {
    try {
      const { id } = req.params;
      const departmentData = req.body;
      
      const existingDepartment = await DepartmentModel.getById(id);
      if (!existingDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      const updatedDepartment = await DepartmentModel.update(id, departmentData);
      res.json({
        message: 'Department updated successfully',
        department: updatedDepartment
      });
    } catch (error) {
      console.error('Error updating department:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Department name already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update department' });
      }
    }
  }

  // Delete a department
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const existingDepartment = await DepartmentModel.getById(id);
      if (!existingDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      await DepartmentModel.delete(id);
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ error: 'Failed to delete department' });
    }
  }

  // Get courses in a department
  static async getCourses(req, res) {
    try {
      const { id } = req.params;
      
      const existingDepartment = await DepartmentModel.getById(id);
      if (!existingDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      const courses = await DepartmentModel.getCourses(id);
      res.json(courses);
    } catch (error) {
      console.error('Error getting department courses:', error);
      res.status(500).json({ error: 'Failed to get department courses' });
    }
  }

  // Get voters in a department
  static async getVoters(req, res) {
    try {
      const { id } = req.params;
      
      const existingDepartment = await DepartmentModel.getById(id);
      if (!existingDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      const voters = await DepartmentModel.getVoters(id);
      res.json(voters);
    } catch (error) {
      console.error('Error getting department voters:', error);
      res.status(500).json({ error: 'Failed to get department voters' });
    }
  }

  // Get candidates in a department
  static async getCandidates(req, res) {
    try {
      const { id } = req.params;
      
      const existingDepartment = await DepartmentModel.getById(id);
      if (!existingDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
      
      const candidates = await DepartmentModel.getCandidates(id);
      res.json(candidates);
    } catch (error) {
      console.error('Error getting department candidates:', error);
      res.status(500).json({ error: 'Failed to get department candidates' });
    }
  }
}

export default DepartmentController; 