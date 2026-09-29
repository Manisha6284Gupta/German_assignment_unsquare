import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all projects with optional filtering
// @route   GET /api/projects
// @access  Public / Private
export const getProjects = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(filter);

    // Calculate aggregated task completion stats for each project
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id });
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const totalTasks = tasks.length;
        const computedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress;
        
        return {
          ...project,
          taskStats: {
            total: totalTasks,
            completed: completedTasks,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            todo: tasks.filter(t => t.status === 'todo').length
          },
          progress: computedProgress
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithTasks.length,
      data: projectsWithTasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public / Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project document not found in MongoDB' });
    }

    const tasks = await Task.find({ projectId: project._id });

    res.status(200).json({
      success: true,
      data: {
        ...project,
        tasks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project document
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { title, description, category, status, priority, budget, deadline, team, tags, progress } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const project = await Project.create({
      title,
      description,
      category,
      status,
      priority,
      budget,
      deadline,
      team,
      tags,
      progress
    });

    await ActivityLog.create(
      'PROJECT_CREATED',
      'Project',
      project._id,
      `Created new project: ${project.title}`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(201).json({
      success: true,
      message: 'Project created in MongoDB collection',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project document
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await ActivityLog.create(
      'PROJECT_UPDATED',
      'Project',
      project._id,
      `Updated project parameters for: ${project.title}`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Project updated in MongoDB',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project document
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Also delete associated tasks (Cascade delete)
    await Task.deleteMany({ projectId: req.params.id });

    await ActivityLog.create(
      'PROJECT_DELETED',
      'Project',
      req.params.id,
      `Deleted project and its tasks: ${project.title}`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted from MongoDB',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
