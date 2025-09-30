// src/components/ResourcesTab.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';

const ResourcesTab = ({ initialResources, courseId, onUpdate }) => {
  const [resources, setResources] = useState(initialResources);
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('LINK'); // Default to LINK

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/courses/${courseId}/resources`, { title, type, content });
      // Clear form and refresh data from parent
      setTitle('');
      setContent('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add resource', error);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
        await apiClient.delete(`/resources/${resourceId}`);
        onUpdate(); // Tell parent to refetch data
    } catch (error) {
        console.error('Failed to delete resource', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Resource Form */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Add a New Resource</h3>
        <form onSubmit={handleAddResource} className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="LINK" checked={type === 'LINK'} onChange={(e) => setType(e.target.value)} className="form-radio bg-slate-700"/>
              <span>Link</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="NOTE" checked={type === 'NOTE'} onChange={(e) => setType(e.target.value)} className="form-radio bg-slate-700"/>
              <span>Note</span>
            </label>
          </div>
          <input type="text" placeholder="Resource Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"/>
          {type === 'LINK' ? (
            <input type="url" placeholder="https://example.com" value={content} onChange={(e) => setContent(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"/>
          ) : (
            <textarea placeholder="Write your note here..." value={content} onChange={(e) => setContent(e.target.value)} required rows="4" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"></textarea>
          )}
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Add Resource</button>
        </form>
      </div>

      {/* Resource List */}
      <div className="space-y-3">
        {resources.map(resource => (
          <div key={resource.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-start border border-slate-700">
            <div>
              <p className="font-bold text-lg text-indigo-400">
                {resource.type === 'LINK' ? '🔗' : '📝'} {resource.title}
              </p>
              {resource.type === 'LINK' ? (
                <a href={resource.content} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:underline break-all">{resource.content}</a>
              ) : (
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{resource.content}</p>
              )}
            </div>
            <button onClick={() => handleDeleteResource(resource.id)} className="text-slate-500 hover:text-red-500 font-bold transition-colors ml-4">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesTab;