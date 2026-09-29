import database, { generateObjectId } from '../config/db.js';

export class Project {
  static get collection() {
    return database.getCollection('projects');
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

  static async create(projectData) {
    const project = {
      _id: generateObjectId(),
      title: projectData.title,
      description: projectData.description || '',
      category: projectData.category || 'General',
      status: projectData.status || 'planning', // planning, active, completed, on-hold
      priority: projectData.priority || 'medium', // low, medium, high, urgent
      progress: Number(projectData.progress) || 0,
      budget: projectData.budget || '$10,000',
      deadline: projectData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      team: Array.isArray(projectData.team) ? projectData.team : ['Sarah Jenkins'],
      tags: Array.isArray(projectData.tags) ? projectData.tags : ['MERN', 'Full-Stack'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.collection.create(project);
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

export default Project;
