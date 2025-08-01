import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard';
import ManageAdmins from './Pages/SuperAdmin/ManageAdmins';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import VoteTraceability from './Pages/Admin/VoteTraceability';
import BallotPositions from './Pages/Admin/BallotPositions';
import BallotCandidates from './Pages/Admin/BallotCandidates';
import UserDashboard from './Pages/User/UserDashboard';
import Positions from './Pages/Positions';
import Candidates from './Pages/Candidates';
import UserCandidates from './Pages/User/UserCandidates';
import Voters from './Pages/Voters';
import Results from './Pages/Results';
import Elections from './Pages/Elections';
import ElectionHistory from './Pages/ElectionHistory';
import BallotHistory from './Pages/BallotHistory';
import UserRegister from './Pages/User/UserRegister';
import Vote from './Pages/User/Vote';
import AdminLogin from './Pages/AdminLogin';
import UserLogin from './Pages/User/UserLogin';
import ForgotPassword from './Pages/ForgotPassword';
import AdminForgotPassword from './Pages/AdminForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import DepartmentManagement from './Pages/DepartmentManagement';
import { getToken, checkCurrentUser } from './services/auth';
import { ElectionProvider } from './contexts/ElectionContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Load Bootstrap FIRST
import './App.css'; // Then custom styles
import './brightness-fix.css'; // Then brightness fixes
import './responsive-fix.css'; // Then responsive fixes

// Admin Route Protection (for admin and superadmin)
function AdminRoute({ children }) {
  const token = getToken();
  const currentUser = checkCurrentUser();

  if (!token || !currentUser.isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
    return <Navigate to="/admin-login" />;
  }
  
  return children;
}

// SuperAdmin Route Protection (superadmin only)
function SuperAdminRoute({ children }) {
  const token = getToken();
  const currentUser = checkCurrentUser();

  if (!token || !currentUser.isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }
  
  if (currentUser.role !== 'superadmin') {
    return <Navigate to="/admin-login" />;
  }
  
  return children;
}

// User Route Protection (user only)
function UserRoute({ children }) {
  const token = getToken();
  const currentUser = checkCurrentUser();

  if (!token || !currentUser.isAuthenticated) {
    return <Navigate to="/user-login" />;
  }
  
  if (currentUser.role !== 'user') {
    return <Navigate to="/user-login" />;
  }
  
  return children;
}

// Admin Layout Component (for admin and superadmin routes)
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Header onToggleSidebar={toggleSidebar} />
      <main>
        {children}
      </main>
    </>
  );
}

// User Layout Component (for user routes)
function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Header onToggleSidebar={toggleSidebar} />
      <main>
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <ElectionProvider>
    <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

            {/* SuperAdmin Routes (SuperAdmin only) */}
            <Route path="/superadmin" element={
              <SuperAdminRoute>
                <AdminLayout>
                  <SuperAdminDashboard />
                </AdminLayout>
              </SuperAdminRoute>
            } />
            <Route path="/superadmin/manage-admins" element={
              <SuperAdminRoute>
                <AdminLayout>
                  <ManageAdmins />
                </AdminLayout>
              </SuperAdminRoute>
            } />

            {/* Admin Routes (Admin and SuperAdmin) */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/positions" element={
              <AdminRoute>
                <AdminLayout>
                  <Positions />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/candidates" element={
              <AdminRoute>
                <AdminLayout>
                  <Candidates />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/voters" element={
              <AdminRoute>
                <AdminLayout>
                  <Voters />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/elections" element={
              <AdminRoute>
                <AdminLayout>
                  <Elections />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/election-history" element={
              <AdminRoute>
                <AdminLayout>
                  <ElectionHistory />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/ballot-history" element={
              <AdminRoute>
                <AdminLayout>
                  <BallotHistory />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/vote-traceability" element={
              <AdminRoute>
                <AdminLayout>
                  <VoteTraceability />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/ballot-positions" element={
              <AdminRoute>
                <AdminLayout>
                  <BallotPositions />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/ballot-candidates" element={
              <AdminRoute>
                <AdminLayout>
                  <BallotCandidates />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/results" element={
              <AdminRoute>
                <AdminLayout>
                  <Results />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/department-management" element={
              <AdminRoute>
                <AdminLayout>
                  <DepartmentManagement />
                </AdminLayout>
              </AdminRoute>
            } />

            {/* User Routes (User only) */}
            <Route path="/user/dashboard" element={
              <UserRoute>
                <UserLayout>
                  <UserDashboard />
                </UserLayout>
              </UserRoute>
            } />
            <Route path="/user/vote" element={
              <UserRoute>
                <UserLayout>
                  <Vote />
                </UserLayout>
              </UserRoute>
            } />
            <Route path="/user/candidates" element={
              <UserRoute>
                <UserLayout>
                  <UserCandidates />
                </UserLayout>
              </UserRoute>
            } />
            <Route path="/user/results" element={
              <UserRoute>
                <UserLayout>
                  <Results />
                </UserLayout>
              </UserRoute>
            } />

            {/* Legacy Route Redirects for backward compatibility */}
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" />} />
            <Route path="/vote" element={<Navigate to="/user/vote" />} />
            <Route path="/candidates" element={<Navigate to="/user/candidates" />} />
            <Route path="/results" element={<Navigate to="/user/results" />} />
            <Route path="/positions" element={<Navigate to="/admin/positions" />} />
            <Route path="/voters" element={<Navigate to="/admin/voters" />} />
            <Route path="/elections" element={<Navigate to="/admin/elections" />} />
            <Route path="/vote-traceability" element={<Navigate to="/admin/vote-traceability" />} />

            {/* Catch all - redirect to appropriate login */}
            <Route path="*" element={<Navigate to="/user-login" />} />
          </Routes>
        </div>
      </Router>
      </ElectionProvider>
  );
}

export default App; 