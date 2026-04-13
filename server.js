const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});