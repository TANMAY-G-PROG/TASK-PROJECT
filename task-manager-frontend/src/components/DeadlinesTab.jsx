// src/components/DeadlinesTab.jsx

import React from 'react';

const DeadlinesTab = ({ items }) => {
  const calculateCurrentGrade = () => {
    const gradedItems = items.filter(item => item.gradeAchieved !== null && item.gradeAchieved >= 0);
    if (gradedItems.length === 0) {
      return { grade: 'N/A', totalWeight: 0 };
    }

    const { totalWeightedScore, totalWeight } = gradedItems.reduce(
      (acc, item) => {
        acc.totalWeightedScore += (item.gradeAchieved / 100) * item.weightage;
        acc.totalWeight += item.weightage;
        return acc;
      },
      { totalWeightedScore: 0, totalWeight: 0 }
    );

    const currentGrade = (totalWeightedScore / totalWeight) * 100;
    
    return {
        grade: currentGrade.toFixed(2),
        totalWeight: (totalWeight * 100).toFixed(0)
    };
  };

  const { grade, totalWeight } = calculateCurrentGrade();

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
      
      {/* Deadlines List */}
      <div>
        {items.map(item => (
          <div key={item.id} className="bg-slate-800 p-4 rounded-lg mb-3 flex justify-between items-center border border-slate-700">
            <div>
              <p className="font-bold text-lg">{item.title} <span className="text-xs ml-2 bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full">{item.type}</span></p>
              <p className="text-sm text-slate-400">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
              <p className="text-sm text-slate-400">Weight: {(item.weightage * 100).toFixed(0)}%</p>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold">{item.gradeAchieved !== null ? `${item.gradeAchieved}%` : 'Not Graded'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesTab;