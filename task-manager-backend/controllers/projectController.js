// controllers/projectController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const creatorId = req.user.userId;

  try {
    // We use a Prisma transaction here. This ensures that BOTH the project
    // and the first project member (the creator) are created successfully.
    // If either fails, both are rolled back, preventing orphaned data.
    const newProject = await prisma.$transaction(async (tx) => {
      // 1. Create the project
      const project = await tx.project.create({
        data: { name, description },
      });

      // 2. Automatically add the creator as the first member with an 'ADMIN' role
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: creatorId,
          role: 'ADMIN',
        },
      });

      return project;
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(400).json({ error: 'Failed to create project.' });
  }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // Security Check: Verify that the person making the request is an admin of the project
        const membership = await prisma.projectMember.findFirst({
            where: {
                projectId: parseInt(id),
                userId: userId,
                role: 'ADMIN',
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Forbidden: You must be an admin to delete this project.' });
        }
        
        // If authorized, delete the project. Associated tasks and members will be deleted automatically
        // because of the "onDelete: Cascade" rule in our schema.
        await prisma.project.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project.' });
    }
};

// @desc    Get all projects a user is a member of
// @route   GET /api/projects
exports.getProjectsForUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    // This query finds all projects where the 'members' list contains
    // at least one entry matching the current user's ID.
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        // Also include member details to show who is in the project
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }, // Only select non-sensitive user info
            },
          },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
};

exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: parseInt(id),
                // Security check: ensure the user is a member of this project
                members: { some: { userId: userId } }
            },
            include: {
                tasks: { orderBy: { id: 'asc' } }, // Order tasks for consistency
                members: { include: { user: { select: { id: true, name: true } } } }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found or you are not a member.' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve project.' });
    }
};

// @desc    Add a new member to a project
// @route   POST /api/projects/:projectId/members
exports.addMemberToProject = async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body; // Add user by their email
    const requesterId = req.user.userId;

    try {
        // 1. Security Check: Verify that the person making the request is an admin of the project
        const requesterMembership = await prisma.projectMember.findFirst({
            where: {
                projectId: parseInt(projectId),
                userId: requesterId,
                role: 'ADMIN',
            }
        });

        if (!requesterMembership) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to add members.' });
        }

        // 2. Find the user to be added
        const userToAdd = await prisma.user.findUnique({ where: { email } });
        if (!userToAdd) {
            return res.status(404).json({ error: 'User with that email not found.' });
        }
        
        // 3. Create the new membership link
        const newMember = await prisma.projectMember.create({
            data: {
                projectId: parseInt(projectId),
                userId: userToAdd.id,
                role: 'MEMBER'
            }
        });
        
        res.status(201).json(newMember);

    } catch (error) {
        // This handles cases where the user is already in the project (due to the unique constraint)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'User is already a member of this project.' });
        }
        console.error("ADD MEMBER ERROR:", error);
        res.status(500).json({ error: 'Failed to add member.' });
    }
};

exports.getRepoActivity = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // 1. Find the project and ensure the user is a member
        const project = await prisma.project.findFirst({
            where: {
                id: parseInt(id),
                members: { some: { userId: userId } }
            }
        });

        // 2. Find the user's GitHub access token
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!project || !project.githubRepo || !user || !user.githubAccessToken) {
            return res.status(404).json({ error: 'Project, linked repo, or GitHub token not found.' });
        }

        // 3. Call the GitHub API
        const repoUrl = `https://api.github.com/repos/${project.githubRepo}/commits`;
        const response = await fetch(repoUrl, {
            headers: {
                // Use the user's stored token for authentication
                'Authorization': `Bearer ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }
        
        const commits = await response.json();
        
        // 4. Send the data back to our frontend
        res.json(commits);

    } catch (error) {
        console.error("Failed to fetch repo activity:", error);
        res.status(500).json({ error: 'Failed to fetch repository activity.' });
    }
};

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const dataToUpdate = req.body; 
    
    try {
        const membership = await prisma.projectMember.findFirst({
            where: {
                projectId: parseInt(id),
                userId: userId,
                role: 'ADMIN',
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Forbidden: You must be an admin to update this project.' });
        }

        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
        });

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project.' });
    }
};