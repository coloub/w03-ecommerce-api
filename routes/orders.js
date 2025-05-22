const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { validateObjectId, validateOrderData } = require('../middleware/validation');

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', getOrders);

// GET /api/orders/:id - Get single order
router.get('/:id', validateObjectId, getOrder);

// POST /api/orders - Create new order
router.post('/', validateOrderData, createOrder);

// PUT /api/orders/:id - Update order
router.put('/:id', validateObjectId, updateOrder);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', validateObjectId, deleteOrder);

module.exports = router;
