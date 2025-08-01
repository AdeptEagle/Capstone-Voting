import React, { useState, useEffect } from 'react';
import { getDepartments, getCoursesByDepartment } from '../services/api';
import DepartmentModal from '../components/Departments/DepartmentModal';
import DepartmentDeleteModal from '../components/Departments/DepartmentDeleteModal';
import CourseModal from '../components/Departments/CourseModal';
import CourseDeleteModal from '../components/Departments/CourseDeleteModal';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCourseDeleteModal, setShowCourseDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      console.log('DepartmentManagement - Received departments:', data);
      
      // Fetch courses for each department
      const departmentsWithCourses = await Promise.all(
        data.map(async (dept) => {
          try {
            const courses = await getCoursesByDepartment(dept.id);
            return { ...dept, courses };
          } catch (err) {
            console.error(`Error fetching courses for ${dept.name}:`, err);
            return { ...dept, courses: [] };
          }
        })
      );
      
      setDepartments(departmentsWithCourses);
      setError('');
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSuccess = () => {
    fetchDepartments();
    setShowDepartmentModal(false);
    setSelectedDepartment(null);
  };

  const handleDeleteSuccess = () => {
    fetchDepartments();
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  };

  const handleCourseSuccess = () => {
    fetchDepartments();
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const handleCourseDeleteSuccess = () => {
    fetchDepartments();
    setShowCourseDeleteModal(false);
    setSelectedCourse(null);
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals for the stats display
  const totalDepartments = departments.length;
  const totalCourses = departments.reduce((total, dept) => total + (dept.courses?.length || 0), 0);
  const totalVoters = departments.reduce((total, dept) => 
    total + dept.courses?.reduce((courseTotal, course) => courseTotal + (course.voterCount || 0), 0) || 0, 0);

  // Department icons mapping
  const departmentIcons = {
    'College of Business and Management': 'fa-chart-line',
    'College of Computer Studies': 'fa-laptop-code',
    'College of Education and Arts': 'fa-graduation-cap',
    'College of Engineering': 'fa-cogs',
    'College of Science': 'fa-flask',
    'College of Medicine': 'fa-user-md',
    'College of Law': 'fa-gavel',
    'College of Arts and Letters': 'fa-paint-brush',
    'College of Social Sciences': 'fa-users',
    'College of Architecture': 'fa-building',
    'default': 'fa-university'
  };

  const getDepartmentIcon = (deptName) => {
    return departmentIcons[deptName] || departmentIcons['default'];
  };

  if (loading) {
    return (
      <div className="department-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="department-management-container">
      {/* Professional Dashboard Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Department Management</h1>
            <p className="dashboard-subtitle-pro">Organize academic departments and their courses for the voting system.</p>
          </div>
          <div className="dashboard-header-actions">
            <button 
              className="btn btn-custom-blue"
              onClick={() => {
                setSelectedDepartment(null);
                setShowDepartmentModal(true);
              }}
            >
              <i className="fas fa-plus me-2"></i>
              Add Department
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="department-stats-row">
        <div className="stat-card-pro">
          <div className="stat-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalDepartments}</div>
            <div className="stat-label">Total Departments</div>
          </div>
        </div>
        <div className="stat-card-pro">
          <div className="stat-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalCourses}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        <div className="stat-card-pro">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalVoters}</div>
            <div className="stat-label">Total Voters</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Search Section */}
      <div className="search-section-pro">
        <div className="search-input-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input-pro"
            placeholder="Search departments by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary btn-sm clear-search"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="departments-grid-pro">
        {filteredDepartments.length === 0 ? (
          <div className="empty-state-pro">
            <div className="empty-icon">
              <i className="fas fa-university"></i>
            </div>
            <h3>No Departments Found</h3>
            <p>{searchTerm ? 'Try adjusting your search criteria' : 'Add your first department to get started'}</p>
            {!searchTerm && (
              <button
                className="btn btn-custom-blue"
                onClick={() => {
                  setSelectedDepartment(null);
                  setShowDepartmentModal(true);
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Create First Department
              </button>
            )}
          </div>
        ) : (
          filteredDepartments.map(department => (
            <div key={department.id} className="department-box-pro">
              {/* Department Header */}
              <div className="department-header-pro">
                <div className="department-info">
                  <div className="department-icon-wrapper">
                    <i className={`fas ${getDepartmentIcon(department.name)} department-icon-pro`}></i>
                  </div>
                  <div className="department-details">
                    <h3 className="department-title">{department.name}</h3>
                    <div className="department-code">Code: {department.code}</div>
                    <div className="department-meta">
                      <span className="course-count">
                        <i className="fas fa-book me-1"></i>
                        {department.courses?.length || 0} Courses
                      </span>
                    </div>
                  </div>
                </div>
                <div className="department-actions">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setSelectedDepartment(department);
                      setSelectedCourse(null);
                      setShowCourseModal(true);
                    }}
                    title="Add Course"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setSelectedDepartment(department);
                      setShowDepartmentModal(true);
                    }}
                    title="Edit Department"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setSelectedDepartment(department);
                      setShowDeleteModal(true);
                    }}
                    title="Delete Department"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              {/* Courses Section */}
              <div className="courses-section-pro">
                <div className="courses-header">
                  <h4>
                    <i className="fas fa-graduation-cap me-2"></i>
                    Courses
                  </h4>
                </div>
                <div className="courses-grid">
                  {department.courses && department.courses.length > 0 ? (
                    department.courses.map(course => (
                      <div key={course.id} className="course-box-pro">
                        <div className="course-info">
                          <div className="course-name">{course.name}</div>
                          <div className="course-code">{course.code}</div>
                          <div className="course-voters">
                            <i className="fas fa-users me-1"></i>
                            {course.voterCount || 0} voters
                          </div>
                        </div>
                        <div className="course-actions">
                          <button
                            className="btn btn-outline-secondary btn-xs"
                            onClick={() => {
                              setSelectedDepartment(department);
                              setSelectedCourse(course);
                              setShowCourseModal(true);
                            }}
                            title="Edit Course"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-xs"
                            onClick={() => {
                              setSelectedDepartment(department);
                              setSelectedCourse(course);
                              setShowCourseDeleteModal(true);
                            }}
                            title="Delete Course"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-courses-pro">
                      <i className="fas fa-book-open"></i>
                      <span>No courses yet</span>
                      <button
                        className="btn btn-link btn-sm"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setSelectedCourse(null);
                          setShowCourseModal(true);
                        }}
                      >
                        Add first course
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showDepartmentModal && (
        <DepartmentModal
          department={selectedDepartment}
          onClose={() => {
            setShowDepartmentModal(false);
            setSelectedDepartment(null);
          }}
          onSuccess={handleDepartmentSuccess}
        />
      )}

      {showDeleteModal && (
        <DepartmentDeleteModal
          department={selectedDepartment}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDepartment(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {showCourseModal && (
        <CourseModal
          departmentId={selectedDepartment?.id}
          course={selectedCourse}
          onClose={() => {
            setShowCourseModal(false);
            setSelectedCourse(null);
          }}
          onSuccess={handleCourseSuccess}
        />
      )}

      {showCourseDeleteModal && (
        <CourseDeleteModal
          department={selectedDepartment}
          course={selectedCourse}
          onClose={() => {
            setShowCourseDeleteModal(false);
            setSelectedCourse(null);
          }}
          onSuccess={handleCourseDeleteSuccess}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;