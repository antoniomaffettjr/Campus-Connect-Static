const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all active products/services
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search, category, type, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { seller: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (type) {
      filter.type = type;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// @route   GET /api/products/admin/all
// @desc    Get all products, including inactive
// @access  Admin
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin products",
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get one product/service
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Create product/service
// @access  Admin
router.post(
  "/",
  protect,
  adminOnly,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("type")
      .isIn(["product", "service"])
      .withMessage("Type must be product or service"),
    body("category").notEmpty().withMessage("Category is required"),
    body("seller").notEmpty().withMessage("Seller is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const product = await Product.create({
        ...req.body,
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update product/service
// @access  Admin
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Soft delete/deactivate product
// @access  Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.json({
      message: "Product deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;