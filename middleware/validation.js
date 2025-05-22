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

// Validate required fields for products
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
      errors: errors
    });
  }
  
  next();
};

// Validate required fields for orders
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
      errors: errors
    });
  }
  
  next();
};

module.exports = {
  validateObjectId,
  validateProductData,
  validateOrderData
};
