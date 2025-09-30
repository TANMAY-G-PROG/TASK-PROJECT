// src/components/DeadlinesTab.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';

const DeadlinesTab = ({ items, courseId, onUpdate }) => {
  // --- State for the "Add Deadline" form ---
  const [title, setTitle] = useState('');
  const [type, setType] = useState('ASSIGNMENT');
  const [dueDate, setDueDate] = useState('');
  const [weightage, setWeightage] = useState('');

  // --- Grade Calculation Logic (no changes here) ---
  const calculateCurrentGrade = () => {
    const gradedItems = items.filter(item => item.gradeAchieved !== null && item.gradeAchieved >= 0);
    if (gradedItems.length === 0) return { grade: 'N/A', totalWeight: 0 };

    const { totalWeightedScore, totalWeight } = gradedItems.reduce((acc, item) => {
        acc.totalWeightedScore += (item.gradeAchieved / 100) * item.weightage;
        acc.totalWeight += item.weightage;
        return acc;
      },{ totalWeightedScore: 0, totalWeight: 0 });

    if (totalWeight === 0) return { grade: 'N/A', totalWeight: 0 };
    const currentGrade = (totalWeightedScore / totalWeight) * 100;
    return { grade: currentGrade.toFixed(2), totalWeight: (totalWeight * 100).toFixed(0) };
  };

  const { grade, totalWeight } = calculateCurrentGrade();

  // --- Handlers for Adding/Updating ---
  const handleAddDeadline = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/courses/${courseId}/gradable-items`, {
        title,
        type,
        dueDate,
        weightage: parseFloat(weightage) / 100, // Convert percentage to decimal
      });
      // Clear form and tell parent to refetch data
      setTitle(''); setType('ASSIGNMENT'); setDueDate(''); setWeightage('');
      onUpdate();
    } catch (error) {
      console.error("Failed to add deadline", error);
    }
  };

  const handleUpdateGrade = async (itemId, newGrade) => {
    // Only update if the grade is a valid number
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
      {/* Grade Summary Card */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Grade Summary</h3>
        <div className="flex justify-around text-center">
            <div>
                <p className="text-4xl font-bold text-indigo-400">{grade}%</p>
                <p className="text-slate-400">Current Weighted Grade</p>
            </div>
            <div>
                <p className="text-4xl font-bold">{totalWeight}%</p>
                <p className="text-slate-400">of Total Grade Completed</p>
            </div>
        </div>
      </div>

      {/* NEW: Add Deadline Form */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Add a New Deadline</h3>
        <form onSubmit={handleAddDeadline} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input type="text" placeholder="Title (e.g., Assignment 1)" value={title} onChange={e => setTitle(e.target.value)} required className="md:col-span-2 w-full px-4 py-2 bg-slate-700 rounded-md"/>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 rounded-md"/>
            <input type="number" placeholder="Weight (%)" value={weightage} onChange={e => setWeightage(e.target.value)} required min="0" max="100" className="w-full px-4 py-2 bg-slate-700 rounded-md"/>
            <button type="submit" className="md:col-span-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Add Deadline</button>
        </form>
      </div>
      
      {/* Deadlines List with Grade Input */}
      <div>
        {items.map(item => (
          <div key={item.id} className="bg-slate-800 p-4 rounded-lg mb-3 grid grid-cols-3 gap-4 items-center border border-slate-700">
            <div className="col-span-2">
              <p className="font-bold text-lg">{item.title} <span className="text-xs ml-2 bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full">{item.type}</span></p>
              <p className="text-sm text-slate-400">Due: {new Date(item.dueDate).toLocaleDateString()} | Weight: {(item.weightage * 100).toFixed(0)}%</p>
            </div>
            <div className="col-span-1 text-right">
                <input 
                    type="number"
                    placeholder="--"
                    defaultValue={item.gradeAchieved !== null ? item.gradeAchieved : ''}
                    onBlur={(e) => handleUpdateGrade(item.id, e.target.value)}
                    min="0" max="100"
                    className="w-24 p-2 text-right bg-slate-700 rounded-md text-xl font-bold"
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesTab;