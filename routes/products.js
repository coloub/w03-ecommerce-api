const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { validateObjectId, validateProductData, validateProductUpdateData } = require('../middleware/validation');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/products - Get all products (public)
router.get('/', getProducts);

// GET /api/products/:id - Get single product (public)
router.get('/:id', validateObjectId, getProduct);

// POST /api/products - Create new product (requires authentication)
router.post('/', authenticateToken, validateProductData, createProduct);

// PUT /api/products/:id - Update product (requires authentication)
router.put('/:id', authenticateToken, validateObjectId, validateProductUpdateData, updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), validateObjectId, deleteProduct);

module.exports = router;
