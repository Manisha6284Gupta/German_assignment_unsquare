import database, { generateObjectId } from '../config/db.js';

export class Product {
  static get collection() {
    return database.getCollection('products');
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

  static async create(productData) {
    const product = {
      _id: generateObjectId(),
      name: productData.name,
      description: productData.description || '',
      category: productData.category || 'Accessories',
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      sku: productData.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      rating: Number(productData.rating) || 5.0,
      reviewsCount: Number(productData.reviewsCount) || 0,
      featured: Boolean(productData.featured),
      tags: Array.isArray(productData.tags) ? productData.tags : ['Tech'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.collection.create(product);
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

export default Product;
