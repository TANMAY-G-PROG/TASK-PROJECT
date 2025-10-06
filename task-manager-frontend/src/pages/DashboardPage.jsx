// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddCourseModal from '../components/AddCourseModal';
import CourseCard from '../components/CourseCard';
import AddProjectModal from '../components/AddProjectModal';
import ProjectCard from '../components/ProjectCard';

const DashboardPage = () => {
  // STATE for both courses and projects
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);

  // SEPARATE state for each modal's visibility
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // UPDATED function to fetch both courses and projects
  const fetchData = async () => {
    try {
      const [coursesRes, projectsRes] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/projects'),
      ]);
      setCourses(coursesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
      setProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project', error);
      alert('Failed to delete project. You must be an admin.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await apiClient.delete(`/courses/${courseId}`);
      setCourses(courses => courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course', error);
      alert('Failed to delete course. You may not be the owner.');
    }
  };

  // useEffect now calls the new fetchData function
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- COURSES SECTION (This part was correct) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Courses</h1>
        <button onClick={() => setIsCourseModalOpen(true)} className="px-5 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg shadow-md transition duration-200">
          + Add Course
        </button>
      </div>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => <CourseCard key={course.id} course={course} onDelete={handleDeleteCourse}/>)}
        </div>
      ) : (
        <p className="text-gray-400">You haven't added any courses yet.</p>
      )}

      {/* --- PROJECTS SECTION (This entire section was missing) --- */}
      <div className="flex justify-between items-center mt-12 mb-6">
        <h1 className="text-3xl font-bold text-white">Collaborative Projects</h1>
        <button onClick={() => setIsProjectModalOpen(true)} className="px-5 py-2 bg-brand-secondary hover:opacity-90 text-white font-semibold rounded-lg shadow-md transition duration-200">
          + New Project
        </button>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Find the current user's role in this specific project
            const currentUserMembership = project.members.find(member => member.userId === user.id);
            const isAdmin = currentUserMembership?.role === 'ADMIN';

            // Pass the delete function and the isAdmin status to the card
            return (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleDeleteProject}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">You're not a part of any projects yet.</p>
      )}

      {/* --- Modals (The AddProjectModal was missing) --- */}
      <AddCourseModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} onCourseAdded={fetchData} />
      <AddProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onProjectAdded={fetchData} />
    </div>
  );
};

export default DashboardPage;