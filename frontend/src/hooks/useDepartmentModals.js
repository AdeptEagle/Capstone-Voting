import { useState } from 'react';

export const useDepartmentModals = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const openCreateDepartmentModal = (resetDepartmentForm) => {
    resetDepartmentForm();
    setShowModal(true);
  };

  const closeCreateDepartmentModal = () => {
    setShowModal(false);
  };

  const openEditDepartmentModal = (department, setDepartmentFormData) => {
    setSelectedDepartment(department);
    setDepartmentFormData({
      id: department.id,
      name: department.name
    });
    setShowEditModal(true);
  };

  const closeEditDepartmentModal = () => {
    setShowEditModal(false);
    setSelectedDepartment(null);
  };

  const openCourseModal = (department, course = null, setCourseFormData) => {
    setSelectedDepartment(department);
    if (course) {
      setEditingCourse(course);
      if (setCourseFormData) {
        setCourseFormData({
          id: course.id,
          name: course.name,
          departmentId: course.departmentId || department.id
        });
      }
    } else {
      setEditingCourse(null);
      if (setCourseFormData) {
        setCourseFormData({
          id: '',
          name: '',
          departmentId: department.id
        });
      }
    }
    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedDepartment(null);
    setEditingCourse(null);
  };

  return {
    // State
    showModal,
    showEditModal,
    showCourseModal,
    selectedDepartment,
    editingCourse,
    
    // Actions
    openCreateDepartmentModal,
    closeCreateDepartmentModal,
    openEditDepartmentModal,
    closeEditDepartmentModal,
    openCourseModal,
    closeCourseModal
  };
};