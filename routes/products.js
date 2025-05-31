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

/**
 * POST /api/products - Create new product
 * Accessible by authenticated users with role 'admin' only
 */
router.post('/', authenticateToken, authorizeRoles('admin'), validateProductData, createProduct);

/**
 * PUT /api/products/:id - Update product
 * Accessible by authenticated users with role 'admin' only
 */
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateObjectId, validateProductUpdateData, updateProduct);

/**
 * DELETE /api/products/:id - Delete product
 * Accessible by authenticated users with role 'admin' only
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), validateObjectId, deleteProduct);

module.exports = router;
