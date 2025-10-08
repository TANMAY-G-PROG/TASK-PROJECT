// src/pages/ProjectPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import io from 'socket.io-client';
import KanbanBoardTab from '../components/KanbanBoardTab';
import ProjectSettingsTab from '../components/ProjectSettingsTab';
import GitActivityTab from '../components/GitActivityTab';

const socket = io('http://localhost:5000');

const ProjectPage = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('board');

  const fetchProject = async () => {
    try {
      // Don't set loading to true on refetch, to avoid screen flicker
      const response = await apiClient.get(`/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    socket.emit('join_project', projectId);
    const handleTaskUpdate = () => {
      fetchProject(); // Refetch all project data on any task update
    };
    socket.on('task_updated', handleTaskUpdate);
    return () => { socket.off('task_updated', handleTaskUpdate); };
  }, [projectId]);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading Project...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-10">{error}</div>;
  }
  if (!project) {
    return <div className="text-center text-white mt-10">Project not found.</div>;
  }

  return (
    // <div className="container mx-auto px-4 py-8 text-white">
    //   <div className="mb-8">
    //     <h1 className="text-4xl font-bold">{project.name}</h1>
    //     <p className="text-xl text-brand-accent font-semibold mt-1">Project Workspace</p>
    //     <p className="text-md text-gray-400 mt-2">{project.description}</p>
    //   </div>
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-xl text-indigo-400 font-semibold mt-1">Project Workspace</p>
        <p className="text-md text-slate-400 mt-2">{project.description}</p>
      </div>

      {/* Tab Navigation - Styled like CoursePage */}
      {/* <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('board')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'board' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}>
            Kanban Board
          </button>
          <button onClick={() => setActiveTab('settings')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'settings' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-white'}`}>
            Members & Settings
          </button>
        </nav>
      </div> */}

      <div className="border-b border-slate-700 mb-6">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('board')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'board' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
            Kanban Board
          </button>
          <button onClick={() => setActiveTab('github')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'github' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
            GitHub
          </button>
          <button onClick={() => setActiveTab('settings')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
            Members & Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'board' && <KanbanBoardTab initialTasks={project.tasks} projectId={project.id} onUpdate={fetchProject} />}
        {activeTab === 'github' && <GitActivityTab project={project} />}
        {activeTab === 'settings' && <ProjectSettingsTab project={project} onUpdate={fetchProject} />}
      </div>
    </div>
  );
};

export default ProjectPage;