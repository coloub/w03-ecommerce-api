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

/**
 * GET /api/orders - Get all orders
 * Accessible by admin only (admin sees all orders)
 * Users see only their own orders (handled in controller)
 */
router.get('/', authenticateToken, authorizeRoles('admin'), getOrders);

/**
 * GET /api/orders/:id - Get single order
 * Accessible by order owner or admin
 */
router.get('/:id', authenticateToken, validateObjectId, getOrder);

/**
 * POST /api/orders - Create new order
 * Accessible by authenticated users (user or admin)
 */
router.post('/', authenticateToken, validateOrderData, createOrder);

/**
 * PUT /api/orders/:id - Update order
 * Accessible by order owner or admin
 */
router.put('/:id', authenticateToken, validateObjectId, validateOrderUpdateData, updateOrder);

/**
 * DELETE /api/orders/:id - Delete order
 * Accessible by order owner or admin
 */
router.delete('/:id', authenticateToken, validateObjectId, deleteOrder);

module.exports = router;
