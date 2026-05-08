function $(id) { return document.getElementById(id); }
function money(n) { return `$${Number(n).toFixed(2)}`; }

async function loadProductsFromAPI() {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    if (Array.isArray(products) && products.length > 0) {
      PRODUCTS = products;
      console.log("Products loaded from MongoDB:", PRODUCTS);
    }
  } catch (error) {
    console.error("Using local product data because API failed:", error.message);
  }
}

let PRODUCTS = [
  { id: 1, name: "Custom CAU Hoodie", type: "product", category: "Clothing & Merch", price: 45, seller: "Jay’s Apparel", rating: 4.8,
    description: "Custom-made hoodie designed by a student entrepreneur. Warm, durable, and campus-ready." },
  { id: 2, name: "Trap Beat License (Non-Exclusive)", type: "product", category: "Digital Products", price: 30, seller: "Tony Beats", rating: 4.9,
    description: "Non-exclusive beat license for student artists. Includes MP3 file for demo and release." },
  { id: 3, name: "CS Tutoring (1 Hour)", type: "service", category: "Tutoring", price: 25, seller: "CodeCoach", rating: 4.7,
    description: "One-hour tutoring session covering Python/Java, data structures, and debugging help." },
  { id: 4, name: "Resume Template Pack", type: "product", category: "Digital Products", price: 10, seller: "CareerLab", rating: 4.6,
    description: "Simple resume templates + checklist to support internship and scholarship applications." },
  { id: 5, name: "Event Photography (Basic Package)", type: "service", category: "Creative Services", price: 75, seller: "LensOnCampus", rating: 4.5,
    description: "60–90 minutes coverage + edited photos delivered in 48 hours." },
  { id: 6, name: "Handmade Sticker Pack", type: "product", category: "Accessories", price: 8, seller: "StickerStudio", rating: 4.4,
    description: "Pack of 8 campus-themed stickers for laptops, bottles, and notebooks." },
  { id: 7, name: "Math Tutoring Session (1 Hour)", type: "service", category: "Tutoring", price: 20, seller: "MathMentor", rating: 4.6,
    description: "Help with algebra, calculus, and statistics using step-by-step examples." },
  { id: 8, name: "Custom Logo Design", type: "service", category: "Creative Services", price: 40, seller: "DesignDen", rating: 4.7,
    description: "Logo design for your student business or org. Includes 2 revisions." },
  { id: 9, name: "Used Data Structures Textbook", type: "product", category: "Books & School Supplies", price: 35, seller: "BookSwap", rating: 4.3,
    description: "Gently used textbook in good condition. Great for CS students." },
  { id: 10, name: "DJ Service for Small Events", type: "service", category: "Event Services", price: 100, seller: "CampusDJ", rating: 4.8,
    description: "DJ for dorm parties and org events. Includes basic sound setup." },
  { id: 11, name: "Study Planner PDF", type: "product", category: "Digital Products", price: 12, seller: "StudyPro", rating: 4.5,
    description: "Printable weekly planner built for college schedules, deadlines, and exam weeks." },
  { id: 12, name: "Braiding Appointment (Starter Styles)", type: "service", category: "Beauty & Personal Services", price: 60, seller: "CampusBraids", rating: 4.6,
    description: "Starter braiding styles with quick consultation and basic hair care tips." }
];


function getUsers() {
  return JSON.parse(localStorage.getItem("cc_users") || "[]");
}
function setUsers(users) {
  localStorage.setItem("cc_users", JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("cc_user") || "null");
}
function setCurrentUser(user) {
  localStorage.setItem("cc_user", JSON.stringify(user));
}
function logout() {
  localStorage.removeItem("cc_user");
  window.location.href = "home.html";
}

function setNavStatus() {
  const el = $("navUserStatus");
  if (!el) return;
  const user = getCurrentUser();
  if (user) {
    el.innerHTML = `Signed in as <strong>${user.name}</strong> (${user.role}) — <a href="#" id="logoutLink"><strong>Logout</strong></a>`;
    const link = $("logoutLink");
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    el.textContent = "Not signed in";
  }
}

function addCurrentProductToCart() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = PRODUCTS.find((p) => String(p._id || p.id) === String(id));

  if (!product) {
    alert("Product not found.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) => String(item._id || item.id) === String(product._id || product.id)
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 1) + 1;
  } else {
    cart.push({
      _id: product._id,
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to cart!");
  window.location.href = "cart.html";
}

async function getCart() {
  try {
    const res = await fetch("/cart");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return await res.json();
  } catch (err) {
    console.error("Error loading cart:", err);
    return [];
  }
}

async function addToCart(item) {
  try {
    const res = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add item");
    }

    alert(`${item.name} added to cart!`);
    await loadCartCount();
    await renderCartPreview();
  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Could not add item to cart.");
  }
}

async function clearCart() {
  try {
    const res = await fetch("/cart/clear", {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }

    alert("Cart cleared.");
    await loadCartCount();
    await renderCartPreview();
  } catch (err) {
    console.error("Clear cart error:", err);
    alert("Could not clear cart.");
  }
}

async function loadCartCount() {
  const cart = await getCart();
  const badge = $("cartCount");
  if (badge) {
    badge.textContent = cart.length;
  }
}

async function renderCartPreview() {
  const wrap = $("cartPreview");
  if (!wrap) return;

  const cart = await getCart();

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="card" style="margin-top:16px;">
        <h3 style="margin-top:0;">Shopping Cart</h3>
        <p class="small">Your cart is empty.</p>
      </div>
    `;
    return;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  wrap.innerHTML = `
    <div class="card" style="margin-top:16px;">
      <div class="row">
        <h3 style="margin:0;">Shopping Cart</h3>
        <button class="btn secondary" id="clearCartBtn">Clear Cart</button>
      </div>
      <div style="margin-top:12px;">
        ${cart.map(item => `
          <div class="row" style="padding:10px 0; border-bottom:1px solid #eee;">
            <div>
              <div><strong>${item.name}</strong></div>
              <div class="small">${item.seller} • ${item.type}</div>
            </div>
            <div class="price">${money(item.price)}</div>
          </div>
        `).join("")}
      </div>
      <div class="row" style="margin-top:12px;">
        <strong>Total</strong>
        <strong>${money(total)}</strong>
      </div>
    </div>
  `;

  const clearBtn = $("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }
}


function renderMarketplace() {
  const grid = $("marketGrid");
  if (!grid) return;

  const search = $("searchInput");
  const category = $("categorySelect");
  const type = $("typeSelect");

  const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  category.innerHTML =
    `<option value="all">All Categories</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");

  function applyFilters() {
    const q = (search.value || "").toLowerCase().trim();
    const cat = category.value || "all";
    const t = type.value || "all";

    let items = [...PRODUCTS];

    if (cat !== "all") items = items.filter(p => p.category === cat);
    if (t !== "all") items = items.filter(p => p.type === t);
    if (q) {
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
      );
    }

    grid.innerHTML = items.map(p => `
      <div class="card">
        <div class="row" style="margin-top:10px;">
          <span class="badge">${p.type.toUpperCase()}</span>
          <span class="small">⭐ ${p.rating}</span>
        </div>
        <h3 style="margin:10px 0 6px;">${p.name}</h3>
        <div class="small">Seller: <strong>${p.seller}</strong></div>
        <div class="small">Category: <strong>${p.category}</strong></div>
        <div class="row" style="margin-top:12px;">
          <div class="price">${money(p.price)}</div>
          <a class="btn secondary" href="product.html?id=${p._id || p.id}">View Details</a>
        </div>
      </div>
    `).join("");
  }

  applyFilters();
  search.addEventListener("input", applyFilters);
  category.addEventListener("change", applyFilters);
  type.addEventListener("change", applyFilters);
}


function renderProductDetail() {
  const wrap = document.querySelector("#productDetail");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = PRODUCTS.find((p) => String(p._id || p.id) === String(id));

  if (!product) {
    wrap.innerHTML = `
      <div class="notice">
        Product not found.
        <a href="marketplace.html"><strong>Back to Marketplace</strong></a>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `

      <div class="card">
        <div class="row">
          <span class="badge">${product.type ? product.type.toUpperCase() : "PRODUCT"}</span>
          <span class="small">⭐ ${product.rating || "N/A"}</span>
        </div>

        <h2 style="margin:10px 0 6px;">${product.name}</h2>

        <div class="small">
          <strong>Category:</strong> ${product.category || "N/A"}
        </div>

        <div class="small">
          <strong>Seller:</strong> ${product.seller || "N/A"}
        </div>

        <p class="small" style="margin-top:12px; line-height:1.5;">
          ${product.description || "No description available."}
        </p>

        <div class="row" style="margin-top:12px;">
          <div class="price">$${Number(product.price || 0).toFixed(2)}</div>
          <button class="btn" id="addToCartBtn">Add to Cart</button>
        </div>
      </div>
    </div>

    <div id="cartPreview"></div>
  `;


}

function addCurrentProductToCart() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = PRODUCTS.find((p) => String(p._id || p.id) === String(id));

  if (!product) {
    alert("Product not found.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) => String(item._id || item.id) === String(product._id || product.id)
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 1) + 1;
  } else {
    cart.push({
      _id: product._id,
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to cart!");
  window.location.href = "cart.html";
}

function handleRegister() {
  const form = $("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("regName").value.trim();
    const email = $("regEmail").value.trim().toLowerCase();
    const password = $("regPassword").value.trim();

    const users = getUsers();

    if (users.some(u => u.email === email)) {
      $("registerMsg").innerHTML = `<div class="notice">That email is already registered. Try logging in.</div>`;
      return;
    }

    const role = email.includes("admin") ? "admin" : "student";
    users.push({ name, email, password, role });
    setUsers(users);
    setCurrentUser({ name, email, role });

    $("registerMsg").innerHTML = `<div class="success">Registered successfully! Redirecting...</div>`;
    setNavStatus();
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 700);
  });
}

function handleLogin() {
  const loginForm = document.querySelector("#loginForm");

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailInput = document.querySelector("#loginEmail");
    const passwordInput = document.querySelector("#loginPassword");

    if (!emailInput || !passwordInput) {
      alert("Login form inputs are missing. Check loginEmail and loginPassword IDs.");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("campusConnectToken", data.token);
      localStorage.setItem("campusConnectUser", JSON.stringify(data.user));

      alert("Login successful!");
      window.location.href = "marketplace.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  });
}



function renderProfile() {
  const wrap = $("profileWrap");
  if (!wrap) return;

  const user = getCurrentUser();

  if (!user) {
    wrap.innerHTML = `<div class="notice">Profile page is secure. Please <a href="login.html"><strong>log in</strong></a>.</div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="card">
      <div class="row">
        <h2 style="margin-top:0;">Member Profile</h2>
        <div class="small">Cart Items: <strong id="cartCount">0</strong></div>
      </div>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <div class="row" style="margin-top:12px;">
        <a class="btn secondary" href="marketplace.html">Go to Marketplace</a>
        <button class="btn" id="logoutBtn">Logout</button>
      </div>
      <p class="small" style="margin-top:12px;">
        Note: This is a placeholder profile page for the class project.
      </p>
    </div>

    <div id="cartPreview"></div>
  `;

  $("logoutBtn").addEventListener("click", logout);
  loadCartCount();
  renderCartPreview();
}


function renderAdmin() {
  const wrap = $("adminWrap");
  if (!wrap) return;

  const user = getCurrentUser();

  if (!user) {
    wrap.innerHTML = `<div class="notice">Admin page is secure. Please <a href="login.html"><strong>log in</strong></a>.</div>`;
    return;
  }

  if (user.role !== "admin") {
    wrap.innerHTML = `<div class="notice">Access denied. You must be an admin to view this page.</div>`;
    return;
  }

  const users = getUsers();

  wrap.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0;">Admin Page</h2>
      <p class="small">This page allows admins to see existing users and view all products.</p>
    </div>

    <div class="grid grid-2" style="margin-top:16px;">
      <div class="card">
        <h3 style="margin-top:0;">Existing Users</h3>
        ${users.length === 0 ? `<div class="small">No users yet. Register a few accounts to populate this table.</div>` : `
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${u.name}</td>
                  <td>${u.email}</td>
                  <td>${u.role}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}
      </div>

      <div class="card">
        <h3 style="margin-top:0;">All Products</h3>
        <table>
          <thead><tr><th>Item</th><th>Type</th><th>Category</th><th>Price</th><th>Seller</th></tr></thead>
          <tbody>
            ${PRODUCTS.map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.type}</td>
                <td>${p.category}</td>
                <td>${money(p.price)}</td>
                <td>${p.seller}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
async function createOrderFromCart() {
  const token = localStorage.getItem("campusConnectToken");

  if (!token) {
    alert("Please log in before checking out.");
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const items = cart.map((item) => ({
    product: item.product || item.productId || item._id || item.id,
    quantity: item.quantity || 1,
    price: Number(item.price || 0),
  }));

  const totalPrice = cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        totalPrice,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Order failed");
      return;
    }

    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong during checkout.");
  }
}

const checkoutBtn = document.querySelector("#checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", createOrderFromCart);
}

function renderCartPage() {
  const cartItemsDiv = document.querySelector("#cartItems");
  const cartTotalSpan = document.querySelector("#cartTotal");

  if (!cartItemsDiv || !cartTotalSpan) {
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p>Your cart is empty.</p>`;
    cartTotalSpan.textContent = "0";
    return;
  }

  cartItemsDiv.innerHTML = cart
    .map(
      (item) => `
        <div class="card" style="margin-bottom: 12px;">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>Quantity: ${item.quantity || 1}</p>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  cartTotalSpan.textContent = total.toFixed(2);
}

async function createOrderFromCart() {
  const token = localStorage.getItem("campusConnectToken");

  if (!token) {
    alert("Please log in before checking out.");
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const totalPrice = cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        totalPrice,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Order failed");
      return;
    }

    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong during checkout.");
  }
}



document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    loadProfilePage();
  }
});

async function loadProfilePage() {
  const profileInfo = document.getElementById("profileInfo");
  const ordersContainer = document.getElementById("ordersContainer");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("campusConnectToken");
  const userData = localStorage.getItem("campusConnectUser");

  if (!token || !userData) {
    profileInfo.innerHTML = `
      <p><strong>Not signed in</strong></p>
      <p>Profile page is secure. Please log in.</p>
      <a href="login.html">Go to Login</a>
    `;

    ordersContainer.innerHTML = `
      <p>You must be logged in to view your orders.</p>
    `;

    return;
  }

  const user = JSON.parse(userData);

  profileInfo.innerHTML = `
    <p><strong>Name:</strong> ${user.name || "N/A"}</p>
    <p><strong>Email:</strong> ${user.email || "N/A"}</p>
    <p><strong>Role:</strong> ${user.role || "Student"}</p>
  `;

  if (logoutBtn) {
    logoutBtn.style.display = "inline-block";

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("campusConnectToken");
      localStorage.removeItem("campusConnectUser");
      localStorage.removeItem("campusConnectCart");

      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }

  await loadUserOrders(token);
}

async function loadUserOrders(token) {
  const ordersContainer = document.getElementById("ordersContainer");

  try {
    const response = await fetch("/api/orders/my-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await response.json();

    if (!response.ok) {
      ordersContainer.innerHTML = `
        <p>Could not load orders: ${orders.message || "Unknown error"}</p>
      `;
      return;
    }

    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <p>You have not placed any orders yet.</p>
        <a href="marketplace.html">Browse Marketplace</a>
      `;
      return;
    }

    ordersContainer.innerHTML = orders
      .map((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();

        const itemsHTML = order.items
          .map((item) => {
            return `
              <li>
                ${item.product?.name || "Product"} 
                — Quantity: ${item.quantity}
                — $${item.price}
              </li>
            `;
          })
          .join("");

        return `
          <div class="order-card">
            <h3>Order ID: ${order._id}</h3>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> ${order.status || "Pending"}</p>
            <p><strong>Total:</strong> $${order.totalPrice}</p>

            <h4>Items:</h4>
            <ul>
              ${itemsHTML}
            </ul>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Order history error:", error);

    ordersContainer.innerHTML = `
      <p>Something went wrong while loading your order history.</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadProductsFromAPI();

  setNavStatus();
  renderMarketplace();
  renderProductDetail();

  const addToCartBtn = document.querySelector("#addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addCurrentProductToCart);
  }

  handleLogin();
  handleRegister();
  renderProfile();
  renderAdmin();
  renderCartPage();

  const checkoutBtn = document.querySelector("#checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", createOrderFromCart);
  }
});

