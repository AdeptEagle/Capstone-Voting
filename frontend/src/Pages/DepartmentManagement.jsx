import React, { useState, useEffect } from 'react';
import { getDepartments, getCoursesByDepartment } from '../services/api';
import DepartmentCard from '../components/Departments/DepartmentCard';
import DepartmentModal from '../components/Departments/DepartmentModal';
import DepartmentDeleteModal from '../components/Departments/DepartmentDeleteModal';
import CourseModal from '../components/Departments/CourseModal';
import CourseDeleteModal from '../components/Departments/CourseDeleteModal';
import DepartmentSearch from '../components/Departments/DepartmentSearch';
import DepartmentHeader from '../components/Departments/DepartmentHeader';
import DepartmentStats from '../components/Departments/DepartmentStats';
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
      setDepartments(data);
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

  return (
    <div className="department-management">
      {/* Header with Stats */}
      <div className="department-header-container">
        <DepartmentHeader 
          onAddDepartment={() => {
            setSelectedDepartment(null);
            setShowDepartmentModal(true);
          }}
        />
        <div className="department-stats-wrapper">
          <div className="stat-card">
            <i className="fas fa-building stat-icon"></i>
            <div className="stat-content">
              <span className="stat-value">{totalDepartments}</span>
              <span className="stat-label">Departments</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-graduation-cap stat-icon"></i>
            <div className="stat-content">
              <span className="stat-value">{totalCourses}</span>
              <span className="stat-label">Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-users stat-icon"></i>
            <div className="stat-content">
              <span className="stat-value">{totalVoters}</span>
              <span className="stat-label">Voters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <DepartmentSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {error && (
        <div className="alert alert-danger mx-4" role="alert">
          {error}
        </div>
      )}

      {/* Departments Grid */}
      <div className="departments-grid">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="no-departments">
            <i className="fas fa-school fa-3x mb-3"></i>
            <h3>No Departments Found</h3>
            <p>{searchTerm ? 'Try adjusting your search' : 'Add your first department to get started'}</p>
          </div>
        ) : (
          filteredDepartments.map(department => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={() => {
                setSelectedDepartment(department);
                setShowDepartmentModal(true);
              }}
              onDelete={() => {
                setSelectedDepartment(department);
                setShowDeleteModal(true);
              }}
              onAddCourse={() => {
                setSelectedDepartment(department);
                setSelectedCourse(null);
                setShowCourseModal(true);
              }}
              onEditCourse={(course) => {
                setSelectedDepartment(department);
                setSelectedCourse(course);
                setShowCourseModal(true);
              }}
              onDeleteCourse={(course) => {
                setSelectedDepartment(department);
                setSelectedCourse(course);
                setShowCourseDeleteModal(true);
              }}
            />
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