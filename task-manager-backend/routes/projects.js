// routes/projects.js

const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjectsForUser,
  addMemberToProject,
} = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');

const { createTaskForProject } = require('../controllers/taskController'); 
const { getProjectById } = require('../controllers/projectController'); 
const { deleteProject } = require('../controllers/projectController');

// Apply authentication to all project routes
router.use(authenticateToken);

router.route('/')
  .get(getProjectsForUser)
  .post(createProject);

router.route('/:projectId/members')
  .post(addMemberToProject);

router.route('/:id').get(getProjectById); 
router.route('/:projectId/tasks').post(createTaskForProject);
router.route('/:id').get(getProjectById).delete(deleteProject);

module.exports = router;