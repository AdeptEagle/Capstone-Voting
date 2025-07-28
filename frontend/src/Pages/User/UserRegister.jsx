import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getDepartments, getCoursesByDepartment } from '../../services/api';
import './UserRegister.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    departmentId: '',
    courseId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const navigate = useNavigate();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load registration data. Please try again.');
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If department changes, reset course and fetch new courses
    if (name === 'departmentId') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseId: '' // Reset course when department changes
      }));
      
      if (value) {
        fetchCourses(value);
      } else {
        setCourses([]);
      }
    }
  };

  const fetchCourses = async (departmentId) => {
    setLoadingCourses(true);
    try {
      const departmentCourses = await getCoursesByDepartment(departmentId);
      setCourses(departmentCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses for selected department.');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Student ID format: YYYY-NNNNN
    const idPattern = /^\d{4}-\d{5}$/;
    if (!idPattern.test(formData.studentId)) {
      setError('Student ID must be in the format YYYY-NNNNN (e.g., 2022-00222)');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!formData.departmentId) {
      setError('Please select your department');
      setLoading(false);
      return;
    }

    if (!formData.courseId) {
      setError('Please select your course');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/user/register', {
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
        departmentId: formData.departmentId,
        courseId: formData.courseId
      });

      console.log('Registration response:', response.data);
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Store token and redirect
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      // Check if the error is actually a success (user created but response had issues)
      if (err.response?.status === 400 && err.response?.data?.error?.includes('successfully')) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-register-split-container">
      {/* Left Panel: System Introduction & Benefits */}
      <div className="user-register-left-panel">
        <div className="user-register-branding">
          <div className="user-register-logo">
            <i className="fas fa-user-plus"></i>
          </div>
          <h1 className="user-register-title">Join the System</h1>
          <p className="user-register-subtitle">Your Voice Matters • Secure • Transparent</p>
        </div>
        
        <div className="user-register-intro">
          <h3>Why Student ID?</h3>
          <p>We use your Student ID to ensure:</p>
          <ul>
            <li><strong>One Vote Per Student:</strong> Prevents duplicate registrations</li>
            <li><strong>Academic Verification:</strong> Confirms your enrollment status</li>
            <li><strong>Secure Access:</strong> Your ID serves as your unique username</li>
            <li><strong>Easy Login:</strong> No need to remember additional usernames</li>
          </ul>
        </div>

        <div className="user-register-benefits">
          <div className="user-register-benefit-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <h4>Instant Access</h4>
              <p>Start voting immediately after registration</p>
            </div>
          </div>
          <div className="user-register-benefit-item">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h4>Secure Voting</h4>
              <p>Your vote is encrypted and protected</p>
            </div>
          </div>
          <div className="user-register-benefit-item">
            <i className="fas fa-chart-bar"></i>
            <div>
              <h4>Real-time Results</h4>
              <p>See live updates as votes are cast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="user-register-right-panel">
        <form className="user-register-form card-shadow" onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          
          {error && <div className="user-register-error">{error}</div>}
          {success && <div className="user-register-success">{success}</div>}

          <div className="user-register-field">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              autoComplete="email"
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="studentId">Student ID *</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="YYYY-NNNNN (e.g., 2022-00222)"
              required
              autoComplete="username"
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="departmentId">
              <i className="fas fa-university me-2"></i>
              Department *
            </label>
            <div className="select-wrapper">
              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={loadingDepartments}
                required
                className="beautiful-select"
              >
                <option value="">Select your department</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>
                    {department.name} ({department.id})
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down select-arrow"></i>
              {loadingDepartments && <div className="loading-spinner"></div>}
            </div>
            <small className="field-help">Choose your academic department</small>
          </div>

          <div className="user-register-field">
            <label htmlFor="courseId">
              <i className="fas fa-graduation-cap me-2"></i>
              Course *
            </label>
            <div className="select-wrapper">
            <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
              onChange={handleChange}
                disabled={!formData.departmentId || loadingCourses}
              required
                className="beautiful-select"
            >
                <option value="">
                  {!formData.departmentId 
                    ? 'Select department first' 
                    : loadingCourses 
                      ? 'Loading courses...' 
                      : 'Select your course'
                  }
                </option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.name}
                </option>
              ))}
            </select>
              <i className="fas fa-chevron-down select-arrow"></i>
              {loadingCourses && <div className="loading-spinner"></div>}
            </div>
            <small className="field-help">Choose your specific course/program</small>
          </div>

          <div className="user-register-field">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="user-register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="back-to-login-link">
            <button type="button" onClick={() => navigate('/')}>
              Already have an account? Sign in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister; 