
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    description: "Enjoy clear sound and wireless comfort.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 1999,
    description: "A stylish watch for everyday use.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Fashion",
    price: 1299,
    description: "Comfortable shoes for daily activities.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Casual Backpack",
    category: "Accessories",
    price: 899,
    description: "Carry your essentials wherever you go.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Classic T-Shirt",
    category: "Fashion",
    price: 499,
    description: "A comfortable everyday wardrobe essential.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Table Lamp",
    category: "Home",
    price: 799,
    description: "Add a warm touch to your study space.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Sunglasses",
    category: "Accessories",
    price: 599,
    description: "A simple accessory for sunny days.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Coffee Mug",
    category: "Home",
    price: 299,
    description: "Enjoy your favourite drink at home.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let selectedCategory = "All";
let searchText = "";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const sortSelect = document.getElementById("sortSelect");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const resultMessage = document.getElementById("resultMessage");
const toast = document.getElementById("toast");

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(price);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  // Automatically hide the message after a short delay.
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderProducts() {
  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  if (sortSelect.value === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortSelect.value === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  resultMessage.textContent =
    `${filteredProducts.length} product(s) found`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="empty-results">No products found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Product';"
      >
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  renderCart();
  showToast(`${product.name} added to cart!`);
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
  showToast("Product removed from cart.");
}

function renderCart() {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your cart is empty. Start shopping!</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-row">
      <img
        class="cart-thumb"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Item';"
      >

      <div class="cart-product">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)} each</p>
        <p>Subtotal: ${formatPrice(item.price * item.quantity)}</p>
      </div>

      <div class="quantity-controls">
        <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
        <span>${item.quantity}</span>
        <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
      </div>

      <button class="remove-button" data-remove="${item.id}">
        Remove
      </button>
    </div>
  `).join("");
}

// Handle product buttons.
productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

// Handle quantity and remove buttons in the cart.
cartItems.addEventListener("click", (event) => {
  const minusButton = event.target.closest("[data-minus]");
  const plusButton = event.target.closest("[data-plus]");
  const removeButton = event.target.closest("[data-remove]");

  if (minusButton) {
    changeQuantity(Number(minusButton.dataset.minus), -1);
  } else if (plusButton) {
    changeQuantity(Number(plusButton.dataset.plus), 1);
  } else if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

// Search as the user types.
searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim().toLowerCase();
  renderProducts();
});

document.getElementById("searchBtn").addEventListener("click", () => {
  searchText = searchInput.value.trim().toLowerCase();
  renderProducts();
  document.getElementById("products").scrollIntoView();
});

// Category filters.
categoryButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  categoryButtons.querySelectorAll(".category").forEach((categoryButton) => {
    categoryButton.classList.toggle(
      "active",
      categoryButton === button
    );
  });

  renderProducts();
});

// Sorting.
sortSelect.addEventListener("change", renderProducts);

// Scroll to cart.
document.getElementById("cartToggle").addEventListener("click", () => {
  document.getElementById("cartSection").scrollIntoView({
    behavior: "smooth"
  });
});

// Clear cart.
document.getElementById("clearCart").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is already empty.");
    return;
  }

  cart = [];
  renderCart();
  showToast("Cart cleared.");
});

// Demo checkout only. This does not create a real order.
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Please add a product before checkout.");
    return;
  }

  showToast("Demo only: backend checkout is not connected yet.");
});

// Initial page rendering.
renderProducts();
renderCart();
