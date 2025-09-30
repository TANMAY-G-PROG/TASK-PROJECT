// controllers/taskController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.createTaskForCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;

  try {
    const course = await prisma.course.findFirst({
      where: { id: parseInt(courseId), userId: req.user.userId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or user not authorized.' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task.' });
  }
};


exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, completed } = req.body;
    
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { title, completed }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task.' });
    }
};

exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        await prisma.task.delete({
            where: { id: parseInt(taskId) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete task.' });
    }
};