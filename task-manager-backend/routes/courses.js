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
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all course routes
router.use(authenticateToken);

router.route('/').get(getAllCourses).post(createCourse);

router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;

const gradableItemRouter = require('./gradableItems');
router.use('/:courseId/gradable-items', gradableItemRouter);