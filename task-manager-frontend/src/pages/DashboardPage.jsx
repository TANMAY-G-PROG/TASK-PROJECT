// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await apiClient.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks(); // Refetch tasks to show the new one
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      await apiClient.put(`/tasks/${task.id}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">My Dashboard</h1>
      
      {/* Create Task Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
          <textarea placeholder="Task Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md"></textarea>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Add Task</button>
        </form>
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className={`p-4 rounded-lg shadow-md flex items-center justify-between transition-colors ${task.completed ? 'bg-green-100 text-gray-500 line-through' : 'bg-white'}`}>
              <div onClick={() => toggleTaskCompletion(task)} className="cursor-pointer flex-1">
                <p className="font-bold text-lg">{task.title}</p>
                <p className="text-sm">{task.description}</p>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="ml-4 text-red-500 hover:text-red-700 font-bold">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;