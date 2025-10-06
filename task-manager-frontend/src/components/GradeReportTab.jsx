// src/components/GradeReportTab.jsx - CORRECTED

import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const GradeReportTab = ({ course, onUpdate }) => {
  const [scores, setScores] = useState({
    courseType: course.courseType || 'THEORY_ONLY',
    cie1: course.cie1 ?? '',
    cie2: course.cie2 ?? '',
    cie3: course.cie3 ?? '',
    aat: course.aat ?? '',
    see: course.see ?? '',
    lab: course.lab ?? '',
  });

  const [results, setResults] = useState({
    finalCIE: 0,
    finalSEE: 0,
    finalAATLab: 0,
    totalMarks: 0,
    grade: 'N/A',
  });

  useEffect(() => {
    calculateFinalGrade();
  }, [scores]);

  // This function ONLY updates the local state on the screen
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScores(prev => ({ ...prev, [name]: value }));
  };

  // NEW: This function intelligently saves data when you click away from an input
  const handleSave = async (e) => {
    const { name, value } = e.target;
    let payloadValue;

    // This is the key change: handle strings and numbers differently
    if (name === 'courseType') {
      payloadValue = value; // Save the course type as a string
    } else {
      payloadValue = value === '' ? null : parseFloat(value); // Save scores as numbers
    }
    
    try {
      await apiClient.put(`/courses/${course.id}`, { [name]: payloadValue });
      onUpdate(); // Refetch the course to confirm the change
    } catch (error) {
      console.error(`Failed to save ${name}`, error);
    }
  };

  const getLetterGrade = (total) => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    if (total >= 35) return 'P';
    return 'F';
  };

  const calculateFinalGrade = () => {
    // Convert empty strings to NaN for safe calculations
    const s = {
        cie1: parseFloat(scores.cie1),
        cie2: parseFloat(scores.cie2),
        cie3: parseFloat(scores.cie3),
        aat: parseFloat(scores.aat),
        see: parseFloat(scores.see),
        lab: parseFloat(scores.lab),
    };

    const cieMarks = [s.cie1, s.cie2, s.cie3].filter(m => !isNaN(m));
    let bestTwoCIEs = 0;
    if (cieMarks.length >= 2) {
      cieMarks.sort((a, b) => b - a);
      bestTwoCIEs = cieMarks[0] + cieMarks[1];
    }
    const avgBestTwo = bestTwoCIEs / 2;

    let finalCIE = 0;
    let finalAATLab = 0;
    let finalSEE = (!isNaN(s.see) ? s.see : 0) / 2;

    if (scores.courseType === 'THEORY_ONLY') {
      finalCIE = avgBestTwo;
      finalAATLab = !isNaN(s.aat) ? s.aat : 0;
    } else { // THEORY_WITH_LAB
      finalCIE = avgBestTwo / 2;
      finalAATLab = (!isNaN(s.lab) ? s.lab : 0) + (!isNaN(s.aat) ? s.aat : 0);
    }

    const totalMarks = finalCIE + finalAATLab + finalSEE;
    setResults({
        finalCIE,
        finalSEE,
        finalAATLab,
        totalMarks: totalMarks.toFixed(2),
        grade: getLetterGrade(totalMarks),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* --- INPUTS --- */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Enter Your Scores</h3>
        {/* Course Type Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Course Type</label>
          <select name="courseType" value={scores.courseType} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md">
            <option value="THEORY_ONLY">Theory Only</option>
            <option value="THEORY_WITH_LAB">Theory with Lab</option>
          </select>
        </div>
        {/* CIE Scores */}
        <div className="grid grid-cols-3 gap-4">
            <div><label>CIE 1 (/40)</label><input type="number" name="cie1" value={scores.cie1} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
            <div><label>CIE 2 (/40)</label><input type="number" name="cie2" value={scores.cie2} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
            <div><label>CIE 3 (/40)</label><input type="number" name="cie3" value={scores.cie3} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
        </div>
        {/* Other Scores */}
        <div><label>AAT Marks (/10)</label><input type="number" name="aat" value={scores.aat} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
        {scores.courseType === 'THEORY_WITH_LAB' && (
            <div><label>Lab Marks (/20)</label><input type="number" name="lab" value={scores.lab} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
        )}
        <div><label>Semester End Exam (/100)</label><input type="number" name="see" value={scores.see} onChange={handleInputChange} onBlur={handleSave} className="w-full mt-1 p-2 bg-slate-700 rounded-md"/></div>
      </div>

      {/* --- RESULTS --- */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center">
        <h3 className="text-xl font-semibold mb-4">Calculated Report</h3>
        <div className="text-center mb-6">
            <p className="text-6xl font-bold text-indigo-400">{results.grade}</p>
            <p className="text-slate-400">Final Grade</p>
        </div>
        <div className="space-y-3 text-lg">
            <div className="flex justify-between"><span>CIE Contribution:</span> <span>{results.finalCIE.toFixed(2)} / {scores.courseType === 'THEORY_ONLY' ? 40 : 20}</span></div>
            <div className="flex justify-between"><span>AAT/Lab Contribution:</span> <span>{results.finalAATLab.toFixed(2)} / {scores.courseType === 'THEORY_ONLY' ? 10 : 30}</span></div>
            <div className="flex justify-between"><span>SEE Contribution:</span> <span>{results.finalSEE.toFixed(2)} / 50</span></div>
            <hr className="border-slate-600 my-2"/>
            <div className="flex justify-between font-bold text-xl"><span>Total Marks:</span> <span>{results.totalMarks} / 100</span></div>
        </div>
      </div>
    </div>
  );
};

export default GradeReportTab;