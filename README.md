# Campus Connect

Campus Connect is a full-stack student marketplace web application designed for students to browse, view, and purchase campus-related products or services. The project was built as a final capstone project to demonstrate frontend development, backend API development, database integration, authentication, and a complete user checkout flow.

## Project Overview

The goal of Campus Connect is to create a simple online marketplace for a campus community. Students can create an account, log in, browse available products, view product details, add products to a cart, checkout, and view their order history from their profile page.

This project demonstrates how a static frontend can be connected to a Node.js and Express backend with MongoDB Atlas for persistent data storage.

## Features

- User registration and login
- JWT-based authentication
- MongoDB Atlas database connection
- Product marketplace loaded from MongoDB
- Product detail pages using MongoDB product IDs
- Shopping cart using localStorage
- Secure checkout using a logged-in user token
- Orders saved in MongoDB
- Profile page showing logged-in user information
- Order history connected to the authenticated user
- Basic protected backend routes
- Seed file for adding starter products to the database

## Technologies Used

### Frontend

- HTML
- CSS
- JavaScript
- localStorage

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcrypt.js
- dotenv
- cors

## Project Structure

```txt
campusconnect/
│
├── config/
│   └── db.js
│
├── data/
│   └── products.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── index.html
│   ├── marketplace.html
│   ├── product.html
│   ├── cart.html
│   ├── login.html
│   ├── register.html
│   └── profile.html
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── seed.js
├── server.js
├── package.json
├── .env
├── .gitignore
└── README.md


How the Application Works
Campus Connect uses a frontend and backend system working together.
The frontend pages are located inside the public folder. These pages allow the user to browse products, view product details, add items to the cart, checkout, and view their profile.
The backend uses Express routes to handle authentication, product data, and order creation. MongoDB Atlas stores users, products, and orders.
When a user logs in, the backend returns a JWT token. The token is saved in localStorage and used during checkout and profile access. This allows the application to connect each order to the correct logged-in user.


Register/Login
↓
Browse Marketplace
↓
View Product Details
↓
Add Product to Cart
↓
Go to Cart
↓
Checkout
↓
Order Saved in MongoDB
↓
Profile Page Shows User Info and Order History

API Routes

POST /api/auth/register
POST /api/auth/login

These routes allow the frontend to load all products and view a single product by its MongoDB ID.
Order Routes
POST /api/orders
GET /api/orders/my-orders
These routes allow a logged-in user to create an order and view their personal order history.
Database Models
User Model
The User model stores user account information such as:
name
email
password
role

    These routes allow the frontend to load all products and view a single product by its MongoDB ID.
Order Routes
POST /api/orders
GET /api/orders/my-orders
These routes allow a logged-in user to create an order and view their personal order history.
Database Models
User Model
The User model stores user account information such as:
name
email
password
roleProduct Model
The Product model stores marketplace product information such as:
name
description
price
category
image
Order Model
The Order model stores checkout information such as:
user
items
totalPrice
status
createdAt
updatedAt
Each order is connected to the user who created it.


How to Run the Project Locally
1. Clone the repository
git clone https://github.com/antoniomaffettjr/Campus-Connect-Static.git
2. Go into the project folder
cd Campus-Connect-Static
3. Install dependencies
npm install
4. Create a .env file
Create a .env file in the root folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
5. Seed the product database
npm run seed
6. Start the server
npm start
7. Open the website
Go to:
http://localhost:3000
Demo Instructions
For the final project demonstration, the recommended flow is:
1. Open the homepage and explain the purpose of Campus Connect.
2. Register a new user or log in with an existing account.
3. Go to the marketplace page.
4. Click a product and view the product detail page.
5. Add the product to the cart.
6. Go to the cart page.
7. Checkout while logged in.
8. Show that the order was saved.
9. Go to the profile page.
10. Show the logged-in user information and order history.
11. Optionally show MongoDB Atlas collections for users, products, and orders.
Capstone Relevance
This project demonstrates several important full-stack development concepts:
Frontend and backend integration
REST API design
Database modeling
Authentication and authorization
JWT token usage
Persistent data storage
Dynamic product rendering
Secure checkout behavior
User-specific order history
Future Improvements
Possible future improvements include:
Seller dashboard for student business owners
Admin dashboard for managing products and users
Product image uploads
Search and filter functionality
Payment integration
Order status updates
User profile editing
Product reviews and ratings
Campus organization or club marketplace categories
Conclusion
Campus Connect is a working full-stack marketplace application that connects a static frontend to a Node.js/Express backend and MongoDB Atlas database. The project includes user authentication, product browsing, cart functionality, checkout, order creation, and profile-based order history. It demonstrates a complete full-stack application flow suitable for a final capstone project.
