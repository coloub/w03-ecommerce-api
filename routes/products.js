const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { validateObjectId, validateProductData } = require('../middleware/validation');

const router = express.Router();

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get single product
router.get('/:id', validateObjectId, getProduct);

// POST /api/products - Create new product
router.post('/', validateProductData, createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', validateObjectId, validateProductData, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', validateObjectId, deleteProduct);

module.exports = router;
