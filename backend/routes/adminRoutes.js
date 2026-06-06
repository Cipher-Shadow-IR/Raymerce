import express from 'express';
import { getUsers, getUserById, deleteUser, getPurchaseLogs, updateOrderStatus } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').get(protect, admin, getUserById).delete(protect, admin, deleteUser);
router.route('/purchase-logs').get(protect, admin, getPurchaseLogs);
router.route('/orders/:id/deliver').put(protect, admin, updateOrderStatus);

export default router;
