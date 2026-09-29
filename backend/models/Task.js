import database, { generateObjectId } from '../config/db.js';

export class Task {
  static get collection() {
    return database.getCollection('tasks');
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

  static async create(taskData) {
    const task = {
      _id: generateObjectId(),
      projectId: taskData.projectId || '',
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo', // todo, in_progress, review, done
      priority: taskData.priority || 'medium', // low, medium, high, urgent
      assignee: taskData.assignee || 'Sarah Jenkins',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: Number(taskData.estimatedHours) || 4,
      completedHours: Number(taskData.completedHours) || 0,
      tags: Array.isArray(taskData.tags) ? taskData.tags : ['Feature'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.collection.create(task);
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

  static async aggregate(pipeline = []) {
    return this.collection.aggregate(pipeline);
  }
}

export default Task;
