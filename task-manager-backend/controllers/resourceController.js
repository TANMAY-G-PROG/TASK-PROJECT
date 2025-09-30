// controllers/resourceController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new resource for a course
// @route   POST /api/courses/:courseId/resources
exports.createResource = async (req, res) => {
  const { courseId } = req.params;
  const { title, type, content } = req.body;

  try {
    // Security Check: Verify the course belongs to the logged-in user
    const course = await prisma.course.findFirst({
      where: { id: parseInt(courseId), userId: req.user.userId },
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found or user not authorized.' });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        content,
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json(resource);
  } catch (error) {
    console.error("Create Resource Error:", error);
    res.status(400).json({ error: 'Failed to create resource.' });
  }
};

exports.deleteResource = async (req, res) => {
    const { resourceId } = req.params;

    try {
        await prisma.resource.delete({
            where: { id: parseInt(resourceId) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete resource.' });
    }
};