// routes/tasks.js

const express = require('express');
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Apply the authentication middleware to all routes in this file
router.use(authenticateToken);

router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;