const Order = require('../models/Order');
const Product = require('../models/Product');

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

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error in getOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    // Validate that all products exist and get their data
    const { items } = req.body;
    let totalAmount = 0;

    // Validate products and calculate total
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      // Set product name and current price
      item.productName = product.name;
      item.price = product.price;

      // Calculate subtotal
      totalAmount += product.price * item.quantity;
    }

    // Set calculated total amount
    req.body.totalAmount = totalAmount;

    const order = await Order.create(req.body);

    // Populate the created order
    const populatedOrder = await Order.findById(order._id)
      .populate('items.productId', 'name price category');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Error in createOrder:', error);

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

// @desc    Update order (partial update with detailed response and auto-recalculation)
// @route   PUT /api/orders/:id
// @access  Public
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId', 'name price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldOrder = order.toObject();

    // If items are being updated, recalculate total and update product details
    if (req.body.items) {
      const { items } = req.body;
      let totalAmount = 0;

      for (let item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        item.productName = product.name;
        item.price = product.price;
        totalAmount += product.price * item.quantity;
      }

      req.body.totalAmount = totalAmount;
    }

    // Update only provided fields
    Object.keys(req.body).forEach(field => {
      order[field] = req.body[field];
    });

    await order.save();

    const newOrder = order.toObject();

    const changes = getChanges(oldOrder, newOrder);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: newOrder,
      changes,
      tips: {
        statuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        validation: 'Only provided fields were validated. Ensure fields meet requirements.'
      }
    });
  } catch (error) {
    console.error('Error in updateOrder:', error);

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

// @desc    Delete order with summary before deletion
// @route   DELETE /api/orders/:id
// @access  Public
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderSummary = {
      id: order._id,
      orderNumber: order.orderNumber || null,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      itemCount: order.items.length,
      status: order.status
    };

    await order.remove();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      deletedResource: orderSummary,
      tip: 'This action cannot be undone'
    });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
};
