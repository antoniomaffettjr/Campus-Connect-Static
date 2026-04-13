# Campus-Connect
A college student marketplace where students can sell and purchases products and services built with HTML, JavaScript, and, CSS
This project converts a static CampusConnect marketplace website into a dynamic ExpressJS application. It includes backend routes for managing a shopping cart using cookies and allows users to add, view, and clear cart items.

Features 
- Browse marketplace listings
- View product details
- User registration and login (localStorage)
- Admin page for users and products
- Add items to cart
- View cart items
- Clear cart

Tehnologies Used
- HTML, CSS, JavaScript
- Node.js
- ExpressJS
- cookie-parser

Project Structure 
express-shopping-cart/
├── server.js
├── routes/
│   └── cart.js
├── public/
│   ├── home.html
│   ├── marketplace.html
│   ├── product.html
│   ├── profile.html
│   ├── login.html
│   ├── register.html
│   ├── admin.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js



How to Run the Project
1. Install dependencies:
npm install

2. Start the server:
node server.js

3. Open in browser:
http://localhost:3000/home.html

API Routes

GET /cart       -> get cart items
POST /cart/add  -> add item to cart
POST /cart/clear -> clear cart

How it Works
The frontend sends requests to Express routes using fetch(). The backend uses cookie-parser to store and retrieve cart data. This allows the cart to persist across page refreshes.

Antonio Maffett Jr
Clark Atlanta University
