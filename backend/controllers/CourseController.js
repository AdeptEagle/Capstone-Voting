import CourseModel from '../models/CourseModel.js';

class CourseController {
  // Get all courses
  static async getAll(req, res) {
    try {
      const courses = await CourseModel.getAll();
      res.json(courses);
    } catch (error) {
      console.error('Error getting courses:', error);
      res.status(500).json({ error: 'Failed to get courses' });
    }
  }

  // Get course by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseModel.getById(id);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json(course);
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ error: 'Failed to get course' });
    }
  }

  // Create a new course
  static async create(req, res) {
    try {
      const courseData = {
        ...req.body,
        created_by: req.user.id
      };
      
      const course = await CourseModel.create(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Course name already exists in this department' });
      } else {
        res.status(500).json({ error: 'Failed to create course' });
      }
    }
  }

  // Update a course
  static async update(req, res) {
    try {
      const { id } = req.params;
      const courseData = req.body;
      
      console.log('Course update request:', { id, courseData });
      
      // Validate required fields
      if (!courseData.name) {
        return res.status(400).json({ error: 'Course name is required' });
      }
      
      if (!courseData.departmentId) {
        return res.status(400).json({ error: 'Department ID is required' });
      }
      
      const existingCourse = await CourseModel.getById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      const updatedCourse = await CourseModel.update(id, courseData);
      res.json({
        message: 'Course updated successfully',
        course: updatedCourse
      });
    } catch (error) {
      console.error('Error updating course:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Course name already exists in this department' });
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({ error: 'Department not found' });
      } else {
        res.status(500).json({ error: 'Failed to update course' });
      }
    }
  }

  // Delete a course
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const existingCourse = await CourseModel.getById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      await CourseModel.delete(id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  }

  // Get courses by department
  static async getByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const courses = await CourseModel.getByDepartment(departmentId);
      res.json(courses);
    } catch (error) {
      console.error('Error getting courses by department:', error);
      res.status(500).json({ error: 'Failed to get courses by department' });
    }
  }

  // Get voters in a course
  static async getVoters(req, res) {
    try {
      const { id } = req.params;
      
      const existingCourse = await CourseModel.getById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      const voters = await CourseModel.getVoters(id);
      res.json(voters);
    } catch (error) {
      console.error('Error getting course voters:', error);
      res.status(500).json({ error: 'Failed to get course voters' });
    }
  }

  // Get candidates in a course
  static async getCandidates(req, res) {
    try {
      const { id } = req.params;
      
      const existingCourse = await CourseModel.getById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      const candidates = await CourseModel.getCandidates(id);
      res.json(candidates);
    } catch (error) {
      console.error('Error getting course candidates:', error);
      res.status(500).json({ error: 'Failed to get course candidates' });
    }
  }
}

export default CourseController; 