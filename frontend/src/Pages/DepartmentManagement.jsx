import React, { useState, useEffect } from 'react';
import { getDepartments, getCourses, getVoters } from '../services/api.js';
import { checkCurrentUser } from '../services/auth.js';
import './DepartmentManagement.css';

// Import components
import DepartmentHeader from '../components/Departments/DepartmentHeader';
import DepartmentSearch from '../components/Departments/DepartmentSearch';
import DepartmentStats from '../components/Departments/DepartmentStats';
import DepartmentCard from '../components/Departments/DepartmentCard';
import DepartmentModal from '../components/Departments/DepartmentModal';
import CourseModal from '../components/Departments/CourseModal';
import DepartmentMessage from '../components/Departments/DepartmentMessage';
import DepartmentDeleteModal from '../components/Departments/DepartmentDeleteModal';
import CourseDeleteModal from '../components/Departments/CourseDeleteModal';

// Import hooks and utilities
import { useDepartmentActions } from '../hooks/useDepartmentActions';
import { useDepartmentModals } from '../hooks/useDepartmentModals';
import { 
  filterDepartments, 
  getVoterCountForDepartment, 
  getDepartmentStats 
} from '../utils/departmentUtils';

const DepartmentManagement = () => {
  const user = checkCurrentUser();
  
  // State management
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete modal states
  const [showDepartmentDeleteModal, setShowDepartmentDeleteModal] = useState(false);
  const [showCourseDeleteModal, setShowCourseDeleteModal] = useState(false);
  const [deletingDepartment, setDeletingDepartment] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [isDeletingDepartment, setIsDeletingDepartment] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  
  // Form data
  const [departmentFormData, setDepartmentFormData] = useState({ id: '', name: '' });
  const [courseFormData, setCourseFormData] = useState({ id: '', name: '', departmentId: '' });

  // Custom hooks
  const {
    loading: actionsLoading,
    handleCreateDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse
  } = useDepartmentActions();

  const {
    showModal,
    showEditModal,
    showCourseModal,
    selectedDepartment,
    editingCourse,
    openCreateDepartmentModal,
    closeCreateDepartmentModal,
    openEditDepartmentModal,
    closeEditDepartmentModal,
    openCourseModal,
    closeCourseModal
  } = useDepartmentModals();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsData, coursesData, votersData] = await Promise.all([
        getDepartments(),
        getCourses(),
        getVoters()
      ]);
      
      setDepartments(departmentsData);
      setCourses(coursesData);
      setVoters(votersData);
    } catch (error) {
      setError('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const filteredDepartments = filterDepartments(departments, searchTerm);
  const stats = getDepartmentStats(departments, courses, voters);

  // Clear message after timeout
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handler functions
  const resetDepartmentForm = () => {
    setDepartmentFormData({ id: '', name: '' });
  };

  // Action handlers
  const onCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await handleCreateDepartment(departmentFormData, departments, setDepartments, setSuccess, setError);
      closeCreateDepartmentModal();
      resetDepartmentForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const onUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateDepartment(selectedDepartment.id, departmentFormData, departments, setDepartments, setSuccess, setError);
      closeEditDepartmentModal();
    } catch (error) {
      // Error handled in hook
    }
  };

  const onDeleteDepartment = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    const associatedCourses = courses.filter(course => course.departmentId === departmentId);
    
    setDeletingDepartment({
      department,
      associatedCourses
    });
    setShowDepartmentDeleteModal(true);
  };

  const confirmDepartmentDelete = async () => {
    if (!deletingDepartment) return;
    
    try {
      setIsDeletingDepartment(true);
      setError('');
      
      await handleDeleteDepartment(
        deletingDepartment.department.id, 
        departments, 
        setDepartments, 
        courses, 
        setCourses, 
        setSuccess, 
        setError
      );
      
      setShowDepartmentDeleteModal(false);
      setDeletingDepartment(null);
      await fetchData();
    } catch (error) {
      console.error('Department deletion failed:', error);
    } finally {
      setIsDeletingDepartment(false);
    }
  };

  const cancelDepartmentDelete = () => {
    setShowDepartmentDeleteModal(false);
    setDeletingDepartment(null);
  };

  const onCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await handleCreateCourse(courseFormData, courses, setCourses, setSuccess, setError);
      closeCourseModal();
      // Force a re-render by updating departments state to trigger course list refresh
      setDepartments([...departments]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const onUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateCourse(editingCourse.id, courseFormData, courses, setCourses, setSuccess, setError);
      closeCourseModal();
      // Force a re-render by updating departments state to trigger course list refresh
      setDepartments([...departments]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const onDeleteCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    const department = departments.find(dept => dept.id === course?.departmentId);
    
    setDeletingCourse({
      course,
      department
    });
    setShowCourseDeleteModal(true);
  };

  const confirmCourseDelete = async () => {
    if (!deletingCourse) return;
    
    try {
      setIsDeletingCourse(true);
      setError('');
      
      await handleDeleteCourse(
        deletingCourse.course.id, 
        courses, 
        setCourses, 
        setSuccess, 
        setError
      );
      
      setShowCourseDeleteModal(false);
      setDeletingCourse(null);
      await fetchData();
    } catch (error) {
      console.error('Course deletion failed:', error);
    } finally {
      setIsDeletingCourse(false);
    }
  };

  const cancelCourseDelete = () => {
    setShowCourseDeleteModal(false);
    setDeletingCourse(null);
  };

  if (loading) {
    return (
      <div className="department-loading">
        <div className="department-spinner"></div>
        <p>Loading departments and courses...</p>
      </div>
    );
  }

  return (
    <div className="department-container">
      <DepartmentHeader onAddDepartment={() => openCreateDepartmentModal(resetDepartmentForm)} />
      
      <DepartmentSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={departments.length}
        filteredCount={filteredDepartments.length}
      />

      <DepartmentMessage 
        message={success || error} 
        onClose={() => { setSuccess(''); setError(''); }} 
      />

      <DepartmentStats stats={stats} />

      <div className="department-grid">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map(department => (
            <DepartmentCard
              key={department.id}
              department={department}
              courses={courses}
              voterCount={getVoterCountForDepartment(voters, department.id)}
              onEdit={() => openEditDepartmentModal(department, setDepartmentFormData)}
              onDelete={onDeleteDepartment}
              onAddCourse={(dept) => openCourseModal(dept, null, setCourseFormData)}
              onEditCourse={(dept, course) => openCourseModal(dept, course, setCourseFormData)}
              onDeleteCourse={onDeleteCourse}
            />
          ))
        ) : (
          <div className="department-empty">
            <div className="department-empty-content">
              <i className="fas fa-university"></i>
              <h3>No Departments Found</h3>
              <p>
                {searchTerm 
                  ? `No departments match "${searchTerm}". Try adjusting your search terms.`
                  : 'Get started by creating your first department to organize your academic structure.'
                }
              </p>
              {!searchTerm && (
                <button 
                  className="department-btn department-btn-primary" 
                  onClick={() => openCreateDepartmentModal(resetDepartmentForm)}
                >
                  <i className="fas fa-plus"></i>
                  Create First Department
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <DepartmentModal
        show={showModal}
        isEditing={false}
        formData={departmentFormData}
        onChange={setDepartmentFormData}
        onSubmit={onCreateDepartment}
        onClose={closeCreateDepartmentModal}
      />

      <DepartmentModal
        show={showEditModal}
        isEditing={true}
        department={selectedDepartment}
        formData={departmentFormData}
        onChange={setDepartmentFormData}
        onSubmit={onUpdateDepartment}
        onClose={closeEditDepartmentModal}
      />

      <CourseModal
        show={showCourseModal}
        isEditing={!!editingCourse}
        department={selectedDepartment}
        formData={courseFormData}
        onChange={setCourseFormData}
        onSubmit={editingCourse ? onUpdateCourse : onCreateCourse}
        onClose={closeCourseModal}
      />

      {/* Department Delete Modal */}
      <DepartmentDeleteModal
        show={showDepartmentDeleteModal}
        department={deletingDepartment?.department}
        associatedCourses={deletingDepartment?.associatedCourses || []}
        onConfirm={confirmDepartmentDelete}
        onCancel={cancelDepartmentDelete}
        isDeleting={isDeletingDepartment}
      />

      {/* Course Delete Modal */}
      <CourseDeleteModal
        show={showCourseDeleteModal}
        course={deletingCourse?.course}
        department={deletingCourse?.department}
        onConfirm={confirmCourseDelete}
        onCancel={cancelCourseDelete}
        isDeleting={isDeletingCourse}
      />
    </div>
  );
};

export default DepartmentManagement;