const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    type: {
      type: String,
      enum: ["product", "service"],
      required: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    seller: {
      type: String,
      required: [true, "Seller name is required"],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 10,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);