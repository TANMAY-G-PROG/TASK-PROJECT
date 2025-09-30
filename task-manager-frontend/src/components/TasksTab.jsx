// src/components/TasksTab.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';

const TasksTab = ({ initialTasks, courseId, onUpdate }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const response = await apiClient.post(`/courses/${courseId}/tasks`, { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleToggleTask = async (taskToToggle) => {
    try {
      const updatedTask = await apiClient.put(`/tasks/${taskToToggle.id}`, {
        completed: !taskToToggle.completed,
      });
      setTasks(tasks.map(task => (task.id === taskToToggle.id ? updatedTask.data : task)));
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div>
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task for this course..."
          className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
        />
        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
          Add
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`p-4 rounded-lg shadow-md flex items-center justify-between transition-colors duration-300 ${task.completed ? 'bg-slate-800 border border-green-700' : 'bg-slate-800 border border-slate-700'}`}
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleToggleTask(task)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${task.completed ? 'border-green-500 bg-green-500' : 'border-slate-500'}`}>
                {task.completed && <span className="text-white font-bold">✓</span>}
              </div>
              <p className={`text-lg ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                {task.title}
              </p>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-slate-500 hover:text-red-500 font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTab;