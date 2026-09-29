import Note from '../models/Note.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public / Private
export const getNotes = async (req, res) => {
  try {
    const { category, search, pinnedOnly } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (pinnedOnly === 'true') {
      filter.isPinned = true;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Public / Private
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note document not found' });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { title, content, category, color, isPinned, tags } = req.body;

    const note = await Note.create({
      title: title || 'Untitled Note',
      content: content || '',
      category: category || 'General',
      color: color || 'cyan',
      isPinned: Boolean(isPinned),
      tags: Array.isArray(tags) ? tags : ['Note'],
      author: req.user?.name || 'Sarah Jenkins'
    });

    await ActivityLog.create(
      'NOTE_CREATED',
      'Note',
      note._id,
      `Created note: "${note.title}"`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(201).json({
      success: true,
      message: 'Note created in MongoDB collection',
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated in MongoDB',
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle pin note
// @route   PATCH /api/notes/:id/pin
// @access  Private
export const togglePinNote = async (req, res) => {
  try {
    const existing = await Note.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const updated = await Note.findByIdAndUpdate(req.params.id, { isPinned: !existing.isPinned });

    res.status(200).json({
      success: true,
      message: updated.isPinned ? 'Note pinned' : 'Note unpinned',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    await ActivityLog.create(
      'NOTE_DELETED',
      'Note',
      req.params.id,
      `Deleted note: "${note.title}"`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Note deleted from MongoDB',
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
