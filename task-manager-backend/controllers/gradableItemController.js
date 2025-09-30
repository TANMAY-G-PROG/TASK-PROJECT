// controllers/gradableItemController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new gradable item for a course
// @route   POST /api/courses/:courseId/gradable-items
exports.createGradableItem = async (req, res) => {
  const { courseId } = req.params;
  const { title, type, dueDate, weightage } = req.body;

  try {
    // SECURITY: First, verify the course belongs to the user
    const course = await prisma.course.findFirst({
        where: { id: parseInt(courseId), userId: req.user.userId }
    });
    if (!course) {
        return res.status(404).json({ error: 'Course not found or user not authorized.' });
    }

    const newItem = await prisma.gradableItem.create({
      data: {
        title,
        type,
        dueDate: new Date(dueDate),
        weightage,
        courseId: parseInt(courseId),
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create gradable item.' });
  }
};

// @desc    Update a gradable item (e.g., to add a grade)
// @route   PUT /api/courses/:courseId/gradable-items/:itemId
exports.updateGradableItem = async (req, res) => {
    const { itemId } = req.params;
    const { gradeAchieved } = req.body; // Assume we are just updating the grade for now

    try {
        // Here you would also add a security check to ensure the parent course belongs to the user
        const updatedItem = await prisma.gradableItem.update({
            where: { id: parseInt(itemId) },
            data: { gradeAchieved }
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update item.' });
    }
}