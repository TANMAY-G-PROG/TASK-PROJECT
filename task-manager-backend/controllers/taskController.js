// controllers/taskController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { authorId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        authorId: req.user.userId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const task = await prisma.task.updateMany({
      where: {
        id: parseInt(id),
        authorId: req.user.userId, // Ensures users can only update their own tasks
      },
      data: { title, description, completed },
    });
    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized.' });
    }
    res.json({ message: 'Task updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.deleteMany({
      where: {
        id: parseInt(id),
        authorId: req.user.userId, // Ensures users can only delete their own tasks
      },
    });
    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized.' });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};