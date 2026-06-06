import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendOrderConfirmation from '../utils/sendEmail.js';
import { getIO } from '../socket.js';

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, phone } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }
    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.qty}`);
    }
  }

  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    phone,
    paymentMethod: 'Cash on Delivery',
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.qty;
    await product.save();
    getIO().emit('stock-updated', { productId: product._id.toString(), stock: product.stock });
  }

  sendOrderConfirmation({
    to: req.user.email,
    name: req.user.name,
    order,
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export { createOrder, getMyOrders, getOrderById, getAllOrders };
