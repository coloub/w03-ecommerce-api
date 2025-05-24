const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { validateObjectId, validateOrderData, validateOrderUpdateData } = require('../middleware/validation');

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', getOrders);

// GET /api/orders/:id - Get single order
router.get('/:id', validateObjectId, getOrder);

// POST /api/orders - Create new order
router.post('/', validateOrderData, createOrder);

// PUT /api/orders/:id - Update order (use partial update validation)
router.put('/:id', validateObjectId, validateOrderUpdateData, updateOrder);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', validateObjectId, deleteOrder);

module.exports = router;
