import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard';
import ManageAdmins from './Pages/SuperAdmin/ManageAdmins';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import VoteTraceability from './Pages/Admin/VoteTraceability';
import UserDashboard from './Pages/User/UserDashboard';
import Positions from './Pages/Positions';
import Candidates from './Pages/Candidates';
import Voters from './Pages/Voters';
import Results from './Pages/Results';
import Elections from './Pages/Elections';
import UserRegister from './Pages/User/UserRegister';
import Vote from './Pages/User/Vote';
import AdminLogin from './Pages/AdminLogin';
import UserLogin from './Pages/User/UserLogin';
import { getRole, getToken } from './services/auth';
import { ElectionProvider } from './contexts/ElectionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function PrivateRoute({ children, role }) {
  const userRole = getRole();
  const token = getToken();

  if (!token) return <Navigate to="/user-login" />;
  if (role) {
    if (Array.isArray(role)) {
      if (!role.includes(userRole)) return <Navigate to="/user-login" />;
    } else {
      if (userRole !== role) return <Navigate to="/user-login" />;
    }
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/user-login';
  };

  return (
    <Router>
      <ElectionProvider>
      <div className="App">
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/vote" element={
            <PrivateRoute role="user">
              <Vote />
            </PrivateRoute>
          } />
          <Route path="/" element={<UserLogin />} />
          <Route path="*" element={
            <>
              <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
              <Header onToggleSidebar={toggleSidebar} />
              <main>
                <Routes>
            <Route path="/superadmin" element={
              <PrivateRoute role="superadmin">
                <SuperAdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/superadmin/manage-admins" element={
              <PrivateRoute role="superadmin">
                <ManageAdmins />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute role={null}>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/positions" element={
              <PrivateRoute>
                <Positions />
              </PrivateRoute>
            } />
            <Route path="/candidates" element={
              <PrivateRoute>
                <Candidates />
              </PrivateRoute>
            } />
            <Route path="/voters" element={
              <PrivateRoute>
                <Voters />
              </PrivateRoute>
            } />
            <Route path="/elections" element={
              <PrivateRoute role={['admin', 'superadmin']}>
                <Elections />
              </PrivateRoute>
            } />
            <Route path="/results" element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            } />
            <Route path="/vote-traceability" element={
              <PrivateRoute role={['admin', 'superadmin']}>
                <VoteTraceability />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/user-login" />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
        </ElectionProvider>
    </Router>
  );
}

export default App; 