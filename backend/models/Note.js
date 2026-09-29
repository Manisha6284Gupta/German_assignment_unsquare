import database, { generateObjectId } from '../config/db.js';

export class Note {
  static get collection() {
    return database.getCollection('notes');
  }

  static async find(filter = {}, options = {}) {
    return this.collection.find(filter, options);
  }

  static async findById(id) {
    return this.collection.findById(id);
  }

  static async findOne(filter = {}) {
    return this.collection.findOne(filter);
  }

  static async create(noteData) {
    const note = {
      _id: generateObjectId(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      category: noteData.category || 'General',
      color: noteData.color || 'cyan', // cyan, amber, emerald, violet, rose, slate
      isPinned: Boolean(noteData.isPinned),
      tags: Array.isArray(noteData.tags) ? noteData.tags : [],
      author: noteData.author || 'Sarah Jenkins',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.collection.create(note);
  }

  static async findByIdAndUpdate(id, updateData, options = { new: true }) {
    return this.collection.findByIdAndUpdate(id, updateData, options);
  }

  static async findByIdAndDelete(id) {
    return this.collection.findByIdAndDelete(id);
  }

  static async countDocuments(filter = {}) {
    return this.collection.countDocuments(filter);
  }
}

export default Note;
