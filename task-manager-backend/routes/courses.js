// routes/courses.js
const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { createTaskForCourse } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const { createResource } = require('../controllers/resourceController');

// Apply authentication middleware to all course routes
router.use(authenticateToken);

router.route('/').get(getAllCourses).post(createCourse);
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);
router.route('/:courseId/tasks').post(createTaskForCourse);
router.route('/:courseId/resources').post(createResource);

const gradableItemRouter = require('./gradableItems');
router.use('/:courseId/gradable-items', gradableItemRouter);

module.exports = router;