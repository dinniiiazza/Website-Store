let cart = [];
let wishlist = [];

try {
  const wishlistData = JSON.parse(localStorage.getItem("wishlist"));
  if (Array.isArray(wishlistData)) {
    wishlist = wishlistData;
  }
} catch (e) {
  wishlist = [];
}

try {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  if (Array.isArray(cartData)) {
    cart = cartData;
  } else {
    throw new Error("Data cart bukan array");
  }
} catch (e) {
  console.warn("Data cart rusak atau tidak ada, reset cart.");
  localStorage.removeItem("cart");
  cart = [];
}

function addToCart(name, price) {
  cart.push({ name, price });
  console.log("Item added to cart:", name);
  saveCart();
  updateCartDisplay();
}

function addToWishlist(name) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.includes(name)) {
    wishlist.push(name);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistDisplay();
  } else {
  }
}

function updateWishlistDisplay() {
  const wishlistItems = document.getElementById("wishlist-items");
  if (!wishlistItems) return;

  wishlistItems.innerHTML = "";
  const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  savedWishlist.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "wishlist-item";
    li.textContent = item;

    const removeBtn = document.createElement("span");
    removeBtn.textContent = " ✕";
    removeBtn.className = "remove-wishlist";
    removeBtn.onclick = () => {
      savedWishlist.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
      updateWishlistDisplay();
    };

    li.appendChild(removeBtn);
    wishlistItems.appendChild(li);
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartDisplay();
}

console.log("Memanggil updateCartDisplay...");
console.log("Isi cart sekarang:", cart);

function updateCartDisplay() {
  console.log("Menjalankan updateCartDisplay...");

  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count");

  const validItems = cart.filter(
    (item) => item && typeof item.price === "number"
  );

  console.log("🛒 Jumlah item cart:", cart.length);
  console.table(cart);

  // Tetap update badge cart di navbar
  if (cartCount) cartCount.textContent = validItems.length;

  // Simpan cart ke localStorage
  saveCart();

  // Kalau elemen cartItems tidak ada, cukup simpan dan keluar
  if (!cartItems || !totalPrice) {
    console.warn("Elemen cartItems atau totalPrice tidak ada di halaman ini.");
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  const isGrid = cartItems.classList.contains("cart-grid");

  validItems.forEach((item, index) => {
    if (isGrid) {
      const card = document.createElement("div");
      card.className = "cart-card";

      const info = document.createElement("p");
      info.textContent = `${item.name} - Rp ${item.price.toLocaleString()}`;

      const removeBtn = document.createElement("span");
      removeBtn.textContent = "✕";
      removeBtn.className = "remove-cart";
      removeBtn.onclick = () => removeItem(index);

      card.appendChild(info);
      card.appendChild(removeBtn);
      cartItems.appendChild(card);
    } else {
      const li = document.createElement("li");
      li.className = "cart-item";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = `${item.name} – Rp ${item.price.toLocaleString()}`;

      const removeBtn = document.createElement("span");
      removeBtn.textContent = "✕";
      removeBtn.className = "remove-cart";
      removeBtn.onclick = () => removeItem(index);

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      cartItems.appendChild(li);
    }

    total += item.price;
  });

  totalPrice.textContent = total.toLocaleString();
}

updateWishlistDisplay();

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("cart is still empty!");
    return;
  }

  let message = "Hello! I want to order:\n";
  let total = 0;
  cart.forEach((item) => {
    message += `- ${item.name}: Rp ${item.price.toLocaleString()}\n`;
    total += item.price;
  });
  message += `\nTotal: Rp ${total.toLocaleString()}`;

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "6289501544089";
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(url, "_blank");
}

function filterProducts(category) {
  const allProducts = document.querySelectorAll(".card");

  allProducts.forEach((product) => {
    const productCategory = product.getAttribute("data-kategori");

    if (category === "all" || category === productCategory) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

let selectedProduct = null;
let selectedPrice = 0;

function openShadeModal(productName) {
  selectedProduct = productName;
  if (productName === "Cushion Sissy") selectedPrice = 85000;
  else if (productName === "Foundation Sissy") selectedPrice = 150000;
  else if (productName === "Concealer Sissy") selectedPrice = 100000;

  document.getElementById("shadeTitle").textContent =
    "Select Your Shade for " + productName;
  document.getElementById("shadeSelect").value = "";
  document.getElementById("shadeModal").style.display = "block";
}

function closeShadeModal() {
  document.getElementById("shadeModal").style.display = "none";
}

function confirmShade() {
  const shade = document.getElementById("shadeSelect").value;
  if (!shade) {
    alert("Please choose a shade first.");
    return;
  }

  addToCart(`${selectedProduct} - ${shade}`, selectedPrice);
  closeShadeModal();
}

window.onclick = function (event) {
  const modal = document.getElementById("shadeModal");
  if (event.target === modal) {
    closeShadeModal();
  }
};

function searchProducts() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartDisplay(); // kalau ada cart
  updateWishlistDisplay(); // ini penting!
  // Login Sederhana
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("username").value.trim();
      if (name) {
        localStorage.setItem("user", name);
        showWelcomeMessage(name);
        const loginSection = document.getElementById("login-section");
        if (loginSection) loginSection.style.display = "none";
      }
    });
  }
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      location.reload();
    });
  }
  // Toggle untuk Cart dan Wishlist
  document
    .getElementById("cart-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("cartModal").style.display = "block";
      updateCartDisplay();
    });

  document
    .getElementById("wishlist-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("wishlistModal").style.display = "block";
      updateWishlistDisplay();
    });

  function showWelcomeMessage(name) {
    const nav = document.querySelector("nav");
    const welcome = document.createElement("span");
    welcome.textContent = `Hi, ${name}!`;
    welcome.style.marginLeft = "10px";
    welcome.style.fontWeight = "bold";
    welcome.style.color = "#ff7eb9";
    nav.appendChild(welcome);
    document.getElementById("login-toggle").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline";
  }
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    showWelcomeMessage(storedUser);
    document.getElementById("login-section").style.display = "none";
  }
});
// Tampilkan form login saat klik tombol Login
const loginToggle = document.getElementById("login-toggle");
if (loginToggle) {
  loginToggle.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.getElementById("login-section");
    if (section) {
      section.style.display =
        section.style.display === "none" ? "block" : "none";
    }
  });
}
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", searchProducts);
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.addEventListener("click", function (event) {
  const cartModal = document.getElementById("cartModal");
  const wishlistModal = document.getElementById("wishlistModal");

  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
  if (event.target === wishlistModal) {
    wishlistModal.style.display = "none";
  }
});
