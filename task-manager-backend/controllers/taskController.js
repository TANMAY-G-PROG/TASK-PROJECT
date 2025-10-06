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
    const { title, completed, status } = req.body;
    
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { title, completed, status }
        });

        if (updatedTask.projectId) {
            // req.io is available thanks to the middleware we added in index.js
            req.io.to(`project-${updatedTask.projectId}`).emit('task_updated', updatedTask);
        }
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

exports.createTaskForProject = async (req, res) => {
    const { projectId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    try {
        // Security Check: Verify the user is a member of the project
        const membership = await prisma.projectMember.findFirst({
            where: { projectId: parseInt(projectId), userId: userId }
        });
        if (!membership) {
            return res.status(403).json({ error: 'You are not a member of this project.' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                projectId: parseInt(projectId),
                status: 'TODO' // Default status
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task.' });
    }
};

// task-manager-backend/controllers/taskController.js

// Add this new function to the file
exports.getTaskById = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(taskId) },
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task.' });
    }
};