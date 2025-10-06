// controllers/CommentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCommentsForTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { taskId: parseInt(taskId) },
            include: { author: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'asc' },
        });
        res.json(comments);
    } catch (error) {
        console.error("GET COMMENTS ERROR:", error);
        res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
};

exports.createComment = async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;
    const authorId = req.user.userId;

    try {
        const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } });
        if (!task || !task.projectId) {
            return res.status(404).json({ error: 'Task or associated project not found.' });
        }
        const newComment = await prisma.comment.create({
            data: { content, taskId: parseInt(taskId), authorId },
            include: { author: { select: { id: true, name: true } } },
        });
        const projectRoom = `project-${task.projectId}`;
        req.io.to(projectRoom).emit('new_comment', newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error("CREATE COMMENT ERROR:", error);
        res.status(400).json({ error: 'Failed to create comment.' });
    }
};