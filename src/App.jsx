import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Shared pages
import Login from './pages/shared/Login';
import Chat from './pages/shared/Chat';

// Member pages
import MemberDashboard from './pages/member/Dashboard';
import MemberEvents from './pages/member/Events';
import MemberLeaderboard from './pages/member/Leaderboard';
import MemberCourses from './pages/member/Courses';
import MemberCertificates from './pages/member/Certificates';
import MemberInnovations from './pages/member/Innovations';
import MemberProfile from './pages/member/Profile';
import Help from './pages/shared/Help';

// Campus pages
import CampusDashboard from './pages/campus/Dashboard';
import CampusMembers from './pages/campus/Members';
import CampusEvents from './pages/campus/Events';
import CampusAnalytics from './pages/campus/Analytics';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminContent from './pages/admin/Content';
import AdminImpact from './pages/admin/Impact';

import { ThemeProvider } from './contexts/ThemeContext';
import Preloader from './components/ui/Preloader';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="member">
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="events" element={<MemberEvents />} />
            <Route path="leaderboard" element={<MemberLeaderboard />} />
            <Route path="courses" element={<MemberCourses />} />
            <Route path="certificates" element={<MemberCertificates />} />
            <Route path="innovations" element={<MemberInnovations />} />
            <Route path="community" element={<Chat />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route path="campus">
            <Route path="dashboard" element={<CampusDashboard />} />
            <Route path="members" element={<CampusMembers />} />
            <Route path="events" element={<CampusEvents />} />
            <Route path="analytics" element={<CampusAnalytics />} />
          </Route>

          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="impact" element={<AdminImpact />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
