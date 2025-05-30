const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { validateObjectId, validateOrderData, validateOrderUpdateData } = require('../middleware/validation');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/orders - Get all orders (admin sees all, users see only their own)
router.get('/', authenticateToken, getOrders);

// GET /api/orders/:id - Get single order (only owner or admin)
router.get('/:id', authenticateToken, validateObjectId, getOrder);

// POST /api/orders - Create new order (requires authentication)
router.post('/', authenticateToken, validateOrderData, createOrder);

// PUT /api/orders/:id - Update order (only owner or admin)
router.put('/:id', authenticateToken, validateObjectId, validateOrderUpdateData, updateOrder);

// DELETE /api/orders/:id - Delete order (only owner or admin)
router.delete('/:id', authenticateToken, validateObjectId, deleteOrder);

module.exports = router;
