// routes/tasks.js

const express = require('express');
const { updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.route('/:taskId').put(updateTask).delete(deleteTask);

module.exports = router;