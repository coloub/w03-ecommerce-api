const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper function to get changed fields between old and new objects
const getChanges = (oldObj, newObj) => {
  const changes = [];
  for (const key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      const oldValue = oldObj[key];
      const newValue = newObj[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue });
      }
    }
  }
  return changes;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error in createProduct:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages,
        tip: 'Please ensure all fields meet validation requirements.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update product (partial update with detailed response)
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const oldProduct = product.toObject();

    // Update only provided fields
    Object.keys(req.body).forEach(field => {
      product[field] = req.body[field];
    });

    await product.save();

    const newProduct = product.toObject();

    const changes = getChanges(oldProduct, newProduct);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: newProduct,
      changes,
      tips: {
        categories: ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'],
        validation: 'Only provided fields were validated. Ensure fields meet requirements.'
      }
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages,
        tip: 'Please check the fields and try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete product with safety checks
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is used in any orders
    const ordersUsingProduct = await Order.find({ 'items.productId': product._id });

    if (ordersUsingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete product. It is used in existing orders.',
        orders: ordersUsingProduct.map(order => ({
          id: order._id,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          status: order.status
        })),
        tip: 'Remove product from orders before deleting or consider disabling the product instead.'
      });
    }

    // Show what will be deleted before actual deletion
    const deletedSummary = {
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price
    };

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedResource: deletedSummary,
      tip: 'This action cannot be undone'
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
