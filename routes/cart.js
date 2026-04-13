const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  res.json(cart);
});

router.post("/add", (req, res) => {
  const item = req.body;
  const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

  cart.push(item);

  res.cookie("cart", JSON.stringify(cart), {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Item added to cart", cart });
});

router.post("/clear", (req, res) => {
  res.clearCookie("cart");
  res.json({ message: "Cart cleared", cart: [] });
});

module.exports = router;