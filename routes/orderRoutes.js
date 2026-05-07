const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order / checkout
// @access  Member
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must include at least one item",
      });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity) || 1;

      if (product.type === "product" && product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        priceAtPurchase: product.price,
        quantity,
      });

      totalPrice += product.price * quantity;

      if (product.type === "product") {
        product.stock -= quantity;
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      status: "paid",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
// @access  Member
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
});

// @route   GET /api/orders/all
// @desc    Get all orders
// @access  Admin
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Admin

// Get logged-in user's orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error while getting orders" });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "paid", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

module.exports = router;