import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all tasks with optional filters
// @route   GET /api/tasks
// @access  Public / Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, projectId, assignee, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (projectId && projectId !== 'all') filter.projectId = projectId;
    if (assignee && assignee !== 'all') filter.assignee = assignee;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public / Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task document not found in MongoDB' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, status, priority, assignee, dueDate, estimatedHours, completedHours, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || 'Sarah Jenkins',
      dueDate,
      estimatedHours,
      completedHours,
      tags
    });

    await ActivityLog.create(
      'TASK_CREATED',
      'Task',
      task._id,
      `Created task: "${task.title}" (Assigned to ${task.assignee})`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(201).json({
      success: true,
      message: 'Task created in MongoDB collection',
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await ActivityLog.create(
      'TASK_UPDATED',
      'Task',
      task._id,
      `Updated task: "${task.title}" [Status: ${task.status}]`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Task updated in MongoDB',
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status (Kanban drag & drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in_progress', 'review', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status enum value' });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { status });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await ActivityLog.create(
      'TASK_STATUS_CHANGED',
      'Task',
      task._id,
      `Moved "${task.title}" to ${status.replace('_', ' ').toUpperCase()}`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await ActivityLog.create(
      'TASK_DELETED',
      'Task',
      req.params.id,
      `Deleted task: "${task.title}"`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Task deleted from MongoDB',
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
