// routes/tasks.js
const express = require('express');
const { updateTask, deleteTask, getTaskById } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const commentRouter = require('./comments');

const router = express.Router();

// Apply authentication to all routes in this file
router.use(authenticateToken);

// Routes for a specific task
router.route('/:taskId').get(getTaskById).put(updateTask).delete(deleteTask);
    
// Nested route for comments on a task
router.use('/:taskId/comments', commentRouter);

module.exports = router;