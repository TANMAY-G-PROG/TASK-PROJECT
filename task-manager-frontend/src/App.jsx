// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import ProjectPage from './pages/ProjectPage';
import TaskDetailPage from './pages/TaskDetailPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/courses/:id" element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } 
            />
            <Route path="/projects/:id" element= {
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>} 
            />
            <Route path="/projects/:projectId/tasks/:taskId" element= {
              <ProtectedRoute>
                <TaskDetailPage />
              </ProtectedRoute>} 
            />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>} 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
