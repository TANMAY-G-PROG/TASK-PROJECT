// controllers/courseController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
  const { courseCode, title, instructor, credits } = req.body;
  const userId = req.user.userId; // From authenticateToken middleware

  try {
    const course = await prisma.course.create({
      data: {
        courseCode,
        title,
        instructor,
        credits,
        userId,
      },
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create course.' });
  }
};

// @desc    Get all courses for a user
// @route   GET /api/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: req.user.userId },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
};

// @desc    Get a single course with all its details
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
        // SECURITY: Ensure the course belongs to the logged-in user
        userId: req.user.userId,
      },
      // Include all related items for the workspace view
      include: {
        tasks: { orderBy: { dueDate: 'asc' } },
        gradableItems: { orderBy: { dueDate: 'asc' } },
        resources: true,
        schedules: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve course.' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
    // Implementation is similar to deleteTask, ensuring user ownership
    // ...
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.course.deleteMany({
            where: {
                id: parseInt(id),
                userId: req.user.userId, // SECURITY CHECK
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Course not found or user not authorized.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete course.' });
    }
};