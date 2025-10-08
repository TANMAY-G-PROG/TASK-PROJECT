// src/pages/CoursePage.jsx - CORRECTED

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import DeadlinesTab from '../components/DeadlinesTab';
import GradeReportTab from '../components/GradeReportTab';
import TasksTab from '../components/TasksTab';
import ResourcesTab from '../components/ResourcesTab';

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('report');
  const { id } = useParams();

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading course...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-10">{error}</div>;
  }
  if (!course) {
    return <div className="text-center text-white mt-10">Course not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="text-xl text-indigo-400 font-semibold">{course.courseCode}</p>
        <p className="text-md text-slate-400 mt-1">{course.instructor}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-700 mb-6">
        <nav className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('report')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'report' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-indigo-400/50 hover:text-white'}`}
          >
            Grade Report
          </button>
          <button 
            onClick={() => setActiveTab('deadlines')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'deadlines' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-indigo-400/50 hover:text-white'}`}
          >
            Deadlines
          </button>
          <button 
            onClick={() => setActiveTab('tasks')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'tasks' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-indigo-400/50 hover:text-white'}`}
          >
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab('resources')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'resources' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-indigo-400/50 hover:text-white'}`}
          >
            Resources
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'report' && <GradeReportTab course={course} onUpdate={fetchCourse} />}
        {activeTab === 'deadlines' && <DeadlinesTab items={course.gradableItems} courseId={course.id} onUpdate={fetchCourse} />}
        {activeTab === 'tasks' && <TasksTab initialTasks={course.tasks} courseId={course.id} onUpdate={fetchCourse} />}
        {activeTab === 'resources' && <ResourcesTab initialResources={course.resources} courseId={course.id} onUpdate={fetchCourse} />}
      </div>
    </div>
  );
};

export default CoursePage;