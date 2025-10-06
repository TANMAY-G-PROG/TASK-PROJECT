// src/components/AddProjectModal.jsx - CORRECTED TO MATCH COURSE MODAL STYLE

import React, { useState } from 'react';
import apiClient from '../services/api';

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/projects', { name, description });
      onProjectAdded(); // Refresh the project list on the dashboard
      onClose();       // Close the modal
      setName('');
      setDescription('');
    } catch (err) {
      setError('Failed to add project. Please try again.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* --- STYLE CHANGE: Matched from AddCourseModal --- */}
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Create a New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name (e.g., Final Year Project)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            // --- STYLE CHANGE: Matched from AddCourseModal ---
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            // --- STYLE CHANGE: Matched from AddCourseModal ---
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          ></textarea>
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-white bg-slate-600 hover:bg-slate-500">
              Cancel
            </button>
            {/* --- STYLE CHANGE: Matched from AddCourseModal --- */}
            <button type="submit" className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;