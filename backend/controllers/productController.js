import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all products with category, price filter & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, inStock, featured, sortBy } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const options = {};
    if (sortBy === 'price_asc') options.sort = { price: 1 };
    else if (sortBy === 'price_desc') options.sort = { price: -1 };
    else if (sortBy === 'rating') options.sort = { rating: -1 };
    else options.sort = { createdAt: -1 };

    const products = await Product.find(filter, options);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product document not found in MongoDB' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, sku, rating, featured, tags } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name and price are required' });
    }

    const product = await Product.create({
      name,
      description,
      category: category || 'Accessories',
      price: Number(price),
      stock: Number(stock) || 0,
      sku,
      rating: Number(rating) || 5.0,
      featured: Boolean(featured),
      tags: Array.isArray(tags) ? tags : ['New']
    });

    await ActivityLog.create(
      'PRODUCT_CREATED',
      'Product',
      product._id,
      `Created product: "${product.name}" ($${product.price})`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(201).json({
      success: true,
      message: 'Product created in MongoDB collection',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await ActivityLog.create(
      'PRODUCT_UPDATED',
      'Product',
      product._id,
      `Updated product: "${product.name}" (Stock: ${product.stock})`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Product updated in MongoDB',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await ActivityLog.create(
      'PRODUCT_DELETED',
      'Product',
      req.params.id,
      `Deleted product: "${product.name}"`,
      req.user?.name || 'Sarah Jenkins'
    );

    res.status(200).json({
      success: true,
      message: 'Product deleted from MongoDB',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
