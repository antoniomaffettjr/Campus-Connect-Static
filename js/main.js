

function $(id) { return document.getElementById(id); }
function money(n) { return `$${Number(n).toFixed(2)}`; }


const PRODUCTS = [
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
    if (link) link.addEventListener("click", (e) => { e.preventDefault(); logout(); });
  } else {
    el.textContent = "Not signed in";
  }
}


function renderMarketplace() {
  const grid = $("marketGrid");
  if (!grid) return;

  const search = $("searchInput");
  const category = $("categorySelect");
  const type = $("typeSelect");

 
  const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  category.innerHTML = `<option value="all">All Categories</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");

  function applyFilters() {
    const q = (search.value || "").toLowerCase().trim();
    const cat = category.value || "all";
    const t = type.value || "all";

    let items = [...PRODUCTS];
    if (cat !== "all") items = items.filter(p => p.category === cat);
    if (t !== "all") items = items.filter(p => p.type === t);
    if (q) items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q)
    );

    grid.innerHTML = items.map(p => `
      <div class="card">
        <div class="thumb">Product Image</div>
        <div class="row" style="margin-top:10px;">
          <span class="badge">${p.type.toUpperCase()}</span>
          <span class="small">⭐ ${p.rating}</span>
        </div>
        <h3 style="margin:10px 0 6px;">${p.name}</h3>
        <div class="small">Seller: <strong>${p.seller}</strong></div>
        <div class="row" style="margin-top:12px;">
          <div class="price">${money(p.price)}</div>
          <a class="btn secondary" href="product.html?id=${p.id}">View Details</a>
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
  const wrap = $("productDetail");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const p = PRODUCTS.find(x => x.id === id);

  if (!p) {
    wrap.innerHTML = `<div class="notice">Product not found. <a href="marketplace.html"><strong>Back to Marketplace</strong></a></div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <div class="thumb" style="height:240px;">Product Image</div>
      </div>
      <div class="card">
        <div class="row">
          <span class="badge">${p.type.toUpperCase()}</span>
          <span class="small">⭐ ${p.rating}</span>
        </div>
        <h2 style="margin:10px 0 6px;">${p.name}</h2>
        <div class="small">Category: <strong>${p.category}</strong></div>
        <div class="small">Seller: <strong>${p.seller}</strong></div>
        <p class="small" style="margin-top:12px; line-height:1.5;">${p.description}</p>
        <div class="row" style="margin-top:12px;">
          <div class="price">${money(p.price)}</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h3 style="margin-top:0;">Ratings & Reviews (Placeholder)</h3>
      <ul class="small">
        <li>“Great quality and fast response.”</li>
        <li>“Would recommend to other students.”</li>
      </ul>
    </div>
  `;
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
    setTimeout(() => window.location.href = "profile.html", 700);
  });
}

function handleLogin() {
  const form = $("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("loginEmail").value.trim().toLowerCase();
    const password = $("loginPassword").value.trim();

    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      $("loginMsg").innerHTML = `<div class="notice">Invalid login. Try registering first.</div>`;
      return;
    }

    setCurrentUser({ name: found.name, email: found.email, role: found.role });
    $("loginMsg").innerHTML = `<div class="success">Logged in! Redirecting...</div>`;
    setNavStatus();
    setTimeout(() => window.location.href = "profile.html", 700);
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
      <h2 style="margin-top:0;">Member Profile</h2>
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
  `;

  $("logoutBtn").addEventListener("click", logout);
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
      <p class="small">This page allows admins to see existing users and view all products (rubric requirement).</p>
    </div>

    <div class="grid grid-2" style="margin-top:16px;">
      <div class="card">
        <h3 style="margin-top:0;">Existing Users</h3>
        ${users.length === 0 ? `<div class="small">No users yet. Register a few accounts to populate this table.</div>` : `
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              ${users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`).join("")}
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

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  setNavStatus();
  renderMarketplace();
  renderProductDetail();
  handleLogin();
  handleRegister();
  renderProfile();
  renderAdmin();
});