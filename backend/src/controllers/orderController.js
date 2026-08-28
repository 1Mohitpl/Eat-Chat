const Order = require("../models/Order");
const logger = require("../config/logger");

// @desc    Place an order (belongs to the logged-in user)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { id, items, totals, name, phone, address, paymentMethod } = req.body;

    if (
      !id ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totals ||
      !name ||
      !phone ||
      !address ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order payload",
      });
    }

    const order = await Order.createOrder({
      id,
      userId: req.user.id,
      items,
      totals,
      name,
      phone,
      address,
      paymentMethod,
    });
    logger.info(`Order ${order.id} placed by ${req.user.email || req.user.id}`);

    res.status(201).json({ success: true, order });
  } catch (error) {
    if (error.code === "23503") {
      // FK violation — token user does not exist in the users table
      return res.status(401).json({
        success: false,
        message: "User not recognized, please log in again",
      });
    }
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Order id already exists" });
    }
    next(error);
  }
};

// @desc    List the logged-in user's orders
// @route   GET /api/orders
// @access  Private
const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.findOrdersByUser(req.user.id);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one of the logged-in user's orders
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOrderById(req.params.id, req.user.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, listOrders, getOrder };
