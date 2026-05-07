const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding...");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();