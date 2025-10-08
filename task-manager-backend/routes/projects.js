// routes/projects.js

// const express = require('express');
// const router = express.Router();
// const {
//   createProject,
//   getProjectsForUser,
//   addMemberToProject,
//   getProjectById,
//   updateProject, 
//   deleteProject,
//   getRepoActivity
// } = require('../controllers/projectController');
// const { authenticateToken } = require('../middleware/auth');

// const { createTaskForProject } = require('../controllers/taskController'); 
// const { getProjectById } = require('../controllers/projectController'); 
// const { deleteProject } = require('../controllers/projectController');
// const { getRepoActivity } = require('../controllers/projectController');

// router.use(authenticateToken);

// router.route('/')
//   .get(getProjectsForUser)
//   .post(createProject);

// router.route('/:projectId/members')
//   .post(addMemberToProject);

// router.route('/:id')
//   .get(getProjectById)
//   .put(updateProject)
//   .delete(deleteProject);

// router.route('/:projectId/tasks').post(createTaskForProject);
// router.route('/:id').get(getProjectById).delete(deleteProject);
// router.route('/:id/repo-activity').get(getRepoActivity);

// module.exports = router;

// routes/projects.js

const express = require('express');
const router = express.Router();

// 1. All functions from projectController are now in one clean import
const {
  createProject,
  getProjectsForUser,
  addMemberToProject,
  getProjectById,
  updateProject, 
  deleteProject,
  getRepoActivity
} = require('../controllers/projectController');

const { createTaskForProject } = require('../controllers/taskController'); 
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.route('/')
  .get(getProjectsForUser)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:projectId/members')
  .post(addMemberToProject);

router.route('/:projectId/tasks')
  .post(createTaskForProject);

router.route('/:id/repo-activity')
  .get(getRepoActivity);


module.exports = router;