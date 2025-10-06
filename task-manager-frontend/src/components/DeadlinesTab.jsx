

import React, { useState } from 'react';
import apiClient from '../services/api';

const DeadlinesTab = ({ items, courseId, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('ASSIGNMENT');
  const [dueDate, setDueDate] = useState('');

  const handleAddDeadline = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/courses/${courseId}/gradable-items`, {
        title,
        type,
        dueDate,
      });
      setTitle(''); setType('ASSIGNMENT'); setDueDate('');
      onUpdate();
    } catch (error) {
      console.error("Failed to add deadline", error);
    }
  };

  const handleUpdateGrade = async (itemId, newGrade) => {
    if (newGrade === '' || isNaN(parseFloat(newGrade))) return;
    try {
        await apiClient.put(`/courses/${courseId}/gradable-items/${itemId}`, {
            gradeAchieved: parseFloat(newGrade)
        });
        onUpdate();
    } catch (error) {
        console.error("Failed to update grade", error);
    }
  };


  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Add a New Deadline</h3>
        <form onSubmit={handleAddDeadline} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input type="text" placeholder="Title (e.g., Assignment 1)" value={title} onChange={e => setTitle(e.target.value)} required className="md:col-span-2 w-full px-4 py-2 bg-slate-700 rounded-md"/>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 rounded-md"/>
            <button type="submit" className="md:col-span-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Add Deadline</button>
        </form>
      </div>
      
      <div>
        {items.map(item => (
          <div key={item.id} className="bg-slate-800 p-4 rounded-lg mb-3 grid grid-cols-3 gap-4 items-center border border-slate-700">
            <div className="col-span-2">
              <p className="font-bold text-lg">{item.title} <span className="text-xs ml-2 bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full">{item.type}</span></p>
              <p className="text-sm text-slate-400">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="col-span-1 text-right">
                <input 
                    type="number"
                    placeholder="--"
                    defaultValue={item.gradeAchieved !== null ? item.gradeAchieved : ''}
                    onBlur={(e) => handleUpdateGrade(item.id, e.target.value)}
                    min="0" max="100"
                    className="w-24 p-2 text-right bg-slate-700 rounded-md text-xl font-bold"
                    aria-label="Grade Input"
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesTab;