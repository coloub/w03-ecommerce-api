const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  next();
};

// Validate required fields for products (full validation)
const validateProductData = (req, res, next) => {
  const { name, description, price, category, brand, quantity } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Product description is required');
  }

  if (price === undefined || price === null) {
    errors.push('Product price is required');
  } else if (isNaN(price) || price < 0) {
    errors.push('Product price must be a positive number');
  }

  if (!category || category.trim() === '') {
    errors.push('Product category is required');
  }

  if (!brand || brand.trim() === '') {
    errors.push('Product brand is required');
  }

  if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
    errors.push('Quantity must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
      tip: 'Ensure all required fields are provided with valid values.'
    });
  }

  next();
};

// Validate required fields for orders (full validation)
const validateOrderData = (req, res, next) => {
  const { customerName, customerEmail, customerPhone, items, shippingAddress } = req.body;
  const errors = [];

  if (!customerName || customerName.trim() === '') {
    errors.push('Customer name is required');
  }

  if (!customerEmail || customerEmail.trim() === '') {
    errors.push('Customer email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
    errors.push('Please enter a valid email address');
  }

  if (!customerPhone || customerPhone.trim() === '') {
    errors.push('Customer phone is required');
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item');
  } else {
    items.forEach((item, index) => {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        errors.push(`Item ${index + 1}: Invalid product ID`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }
      if (!item.price || item.price < 0) {
        errors.push(`Item ${index + 1}: Price must be a positive number`);
      }
    });
  }

  if (!shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const { street, city, state, zipCode } = shippingAddress;
    if (!street || street.trim() === '') errors.push('Street address is required');
    if (!city || city.trim() === '') errors.push('City is required');
    if (!state || state.trim() === '') errors.push('State is required');
    if (!zipCode || zipCode.trim() === '') errors.push('Zip code is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
      tip: 'Ensure all required fields are provided with valid values.'
    });
  }

  next();
};

// Validate product update data (partial validation)
const validateProductUpdateData = (req, res, next) => {
  const allowedFields = ['name', 'description', 'price', 'category', 'brand', 'quantity'];
  const receivedFields = Object.keys(req.body);
  const errors = [];

  // Check for unknown fields
  const unknownFields = receivedFields.filter(field => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    errors.push(`Unknown field(s): ${unknownFields.join(', ')}`);
  }

  // Validate only provided fields
  if (req.body.name !== undefined && (typeof req.body.name !== 'string' || req.body.name.trim() === '')) {
    errors.push('Product name must be a non-empty string');
  }

  if (req.body.description !== undefined && (typeof req.body.description !== 'string' || req.body.description.trim() === '')) {
    errors.push('Product description must be a non-empty string');
  }

  if (req.body.price !== undefined) {
    if (isNaN(req.body.price) || req.body.price < 0) {
      errors.push('Product price must be a positive number');
    }
  }

  if (req.body.category !== undefined && (typeof req.body.category !== 'string' || req.body.category.trim() === '')) {
    errors.push('Product category must be a non-empty string');
  }

  if (req.body.brand !== undefined && (typeof req.body.brand !== 'string' || req.body.brand.trim() === '')) {
    errors.push('Product brand must be a non-empty string');
  }

  if (req.body.quantity !== undefined) {
    if (isNaN(req.body.quantity) || req.body.quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
      tip: 'Only provide valid fields to update. Refer to API documentation for available fields and formats.'
    });
  }

  next();
};

// Validate order update data (partial validation)
const validateOrderUpdateData = (req, res, next) => {
  const allowedFields = ['customerName', 'customerEmail', 'customerPhone', 'items', 'shippingAddress', 'status'];
  const receivedFields = Object.keys(req.body);
  const errors = [];

  // Check for unknown fields
  const unknownFields = receivedFields.filter(field => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    errors.push(`Unknown field(s): ${unknownFields.join(', ')}`);
  }

  if (req.body.customerName !== undefined && (typeof req.body.customerName !== 'string' || req.body.customerName.trim() === '')) {
    errors.push('Customer name must be a non-empty string');
  }

  if (req.body.customerEmail !== undefined) {
    if (typeof req.body.customerEmail !== 'string' || req.body.customerEmail.trim() === '') {
      errors.push('Customer email must be a non-empty string');
    } else if (!/^\S+@\S+\.\S+$/.test(req.body.customerEmail)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (req.body.customerPhone !== undefined && (typeof req.body.customerPhone !== 'string' || req.body.customerPhone.trim() === '')) {
    errors.push('Customer phone must be a non-empty string');
  }

  if (req.body.items !== undefined) {
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      errors.push('Items must be a non-empty array');
    } else {
      req.body.items.forEach((item, index) => {
        if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
          errors.push(`Item ${index + 1}: Invalid product ID`);
        }
        if (!item.quantity || item.quantity < 1) {
          errors.push(`Item ${index + 1}: Quantity must be at least 1`);
        }
      });
    }
  }

  if (req.body.shippingAddress !== undefined) {
    const { street, city, state, zipCode } = req.body.shippingAddress;
    if (!street || street.trim() === '') errors.push('Street address is required');
    if (!city || city.trim() === '') errors.push('City is required');
    if (!state || state.trim() === '') errors.push('State is required');
    if (!zipCode || zipCode.trim() === '') errors.push('Zip code is required');
  }

  if (req.body.status !== undefined) {
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(req.body.status)) {
      errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
      tip: 'Only provide valid fields to update. Refer to API documentation for available fields and formats.'
    });
  }

  next();
};

// New validation for registration data
const validateRegistrationData = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (role !== undefined && !['user', 'admin'].includes(role)) {
    errors.push('Role must be either "user" or "admin"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors
    });
  }

  next();
};

// New validation for login data
const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors
    });
  }

  next();
};

// Middleware to validate resource ownership for orders
const validateOrderOwnership = (req, res, next) => {
  const user = req.user;
  const orderUserId = req.orderUserId; // This should be set in controller after fetching order

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  if (user.role === 'admin' || user.id === orderUserId.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden: You do not have permission to access this resource'
  });
};

module.exports = {
  validateObjectId,
  validateProductData,
  validateOrderData,
  validateProductUpdateData,
  validateOrderUpdateData,
  validateRegistrationData,
  validateLoginData,
  validateOrderOwnership
};
