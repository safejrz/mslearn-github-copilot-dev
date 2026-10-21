"use strict";

const products = [
  { id: "apples", name: "Apples", description: "Crisp, sweet apples for snacking.", priceCents: 120, unit: "each", emoji: "🍎" },
  { id: "bananas", name: "Bananas", description: "Ripe bananas with a naturally sweet flavor.", priceCents: 60, unit: "each", emoji: "🍌" },
  { id: "oranges", name: "Oranges", description: "Juicy oranges with a bright citrus taste.", priceCents: 100, unit: "each", emoji: "🍊" },
  { id: "strawberries", name: "Strawberries", description: "Sweet, fresh strawberries.", priceCents: 450, unit: "per pound", emoji: "🍓" },
  { id: "grapes", name: "Grapes", description: "Seedless grapes for snacking or sharing.", priceCents: 325, unit: "per pound", emoji: "🍇" },
  { id: "watermelon", name: "Watermelon", description: "Refreshing watermelon with a crisp texture.", priceCents: 80, unit: "per pound", emoji: "🍉" },
  { id: "pineapple", name: "Pineapple", description: "Tropical pineapple with a sweet-tart flavor.", priceCents: 350, unit: "each", emoji: "🍍" },
  { id: "mangoes", name: "Mangoes", description: "Soft, sweet mangoes.", priceCents: 175, unit: "each", emoji: "🥭" },
  { id: "pears", name: "Pears", description: "Juicy pears with a mild sweetness.", priceCents: 130, unit: "each", emoji: "🍐" },
  { id: "cherries", name: "Cherries", description: "Sweet cherries, great for a snack.", priceCents: 500, unit: "per pound", emoji: "🍒" },
];

const main = document.querySelector("#main-content");
const cartCount = document.querySelector("#cart-count");
const cart = new Map();
const productQuantities = new Map();
let notice = "";
let orderCompleted = false;

const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

function currentRoute() {
  const hash = window.location.hash.slice(1) || "/products";
  const [path, query = ""] = hash.split("?");
  const segments = path.split("/").filter(Boolean);
  const route = segments[0] || "products";
  return {
    page: ["products", "product-details", "shopping-cart", "checkout"].includes(route)
      ? route
      : "products",
    productId: segments[1] || new URLSearchParams(query).get("id"),
  };
}

function itemCount() {
  return [...cart.values()].reduce((total, quantity) => total + quantity, 0);
}

function totalCents() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + (product ? product.priceCents * quantity : 0);
  }, 0);
}

function setActiveNavigation(page) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.page === page) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function pageHeader(title, intro, eyebrow = "Fruit Shop") {
  return `
    <header class="page-header">
      <div>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="page-intro">${escapeHtml(intro)}</p>
      </div>
    </header>`;
}

function renderNotice() {
  if (!notice) return "";
  return `<p class="notice" role="status">${escapeHtml(notice)}</p>`;
}

function productCard(product) {
  const quantity = productQuantities.get(product.id) || 1;
  return `
    <article class="product-card">
      <div class="product-emoji" aria-hidden="true">${product.emoji}</div>
      <h2>${escapeHtml(product.name)}</h2>
      <p class="product-price">${money(product.priceCents)} ${escapeHtml(product.unit)}</p>
      <div class="product-actions">
        <a class="details-link" href="#/product-details/${product.id}">View details</a>
        <div class="quantity-control">
          <label for="product-qty-${product.id}">Quantity</label>
          <div class="quantity-stepper">
            <button type="button" data-action="step-product" data-product-id="${product.id}" data-step="-1" aria-label="Decrease ${escapeHtml(product.name)} quantity">−</button>
            <input id="product-qty-${product.id}" type="number" min="1" step="1" value="${quantity}" inputmode="numeric" data-product-quantity="${product.id}" aria-label="${escapeHtml(product.name)} quantity">
            <button type="button" data-action="step-product" data-product-id="${product.id}" data-step="1" aria-label="Increase ${escapeHtml(product.name)} quantity">+</button>
          </div>
        </div>
        <button class="button" type="button" data-action="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </article>`;
}

function renderProducts() {
  setActiveNavigation("products");
  main.innerHTML = `
    ${pageHeader("Fresh fruit, picked for you", "Browse the fruit stand and add your favorites to the cart.", "Our produce")}
    ${renderNotice()}
    <section class="product-grid" aria-label="Fruit products">
      ${products.map(productCard).join("")}
    </section>`;
}

function renderProductDetails(productId) {
  setActiveNavigation("product-details");
  const product = products.find((item) => item.id === productId);
  if (!product) {
    main.innerHTML = `
      ${pageHeader("Product details", "Choose a fruit from our catalog to see more.", "Our produce")}
      <section class="empty-state">
        <div class="empty-icon" aria-hidden="true">🍊</div>
        <h2>No product selected</h2>
        <p>Select a product from the catalog to view its details.</p>
        <a class="button" href="#/products">Browse Products</a>
      </section>`;
    return;
  }

  const quantity = productQuantities.get(product.id) || 1;
  main.innerHTML = `
    ${renderNotice()}
    <a class="back-link" href="#/products">← Back to Products</a>
    <section class="panel detail-layout">
      <div class="detail-emoji" aria-hidden="true">${product.emoji}</div>
      <div class="detail-copy">
        <p class="eyebrow">Product Details</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="detail-description">${escapeHtml(product.description)}</p>
        <p class="detail-price">${money(product.priceCents)} ${escapeHtml(product.unit)}</p>
        <div class="detail-actions">
          <div class="quantity-control">
            <label for="detail-quantity">Quantity</label>
            <div class="quantity-stepper">
              <button type="button" data-action="step-detail" data-step="-1" aria-label="Decrease quantity">−</button>
              <input id="detail-quantity" type="number" min="1" step="1" value="${quantity}" inputmode="numeric" data-detail-quantity="${product.id}" aria-label="${escapeHtml(product.name)} quantity">
              <button type="button" data-action="step-detail" data-step="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="button" type="button" data-action="add-detail-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </section>`;
}

function cartRows() {
  return [...cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return "";
    return `
      <tr>
        <td>
          <div class="cart-product">
            <span class="cart-product-emoji" aria-hidden="true">${product.emoji}</span>
            <span>${escapeHtml(product.name)}</span>
          </div>
        </td>
        <td>
          <div class="quantity-stepper">
            <button type="button" data-action="step-cart" data-product-id="${product.id}" data-step="-1" aria-label="Decrease ${escapeHtml(product.name)} quantity">−</button>
            <input type="number" min="0" step="1" value="${quantity}" inputmode="numeric" data-cart-quantity="${product.id}" aria-label="${escapeHtml(product.name)} quantity">
            <button type="button" data-action="step-cart" data-product-id="${product.id}" data-step="1" aria-label="Increase ${escapeHtml(product.name)} quantity">+</button>
          </div>
        </td>
        <td>${money(product.priceCents * quantity)}</td>
        <td><button class="button button-danger" type="button" data-action="remove" data-product-id="${product.id}">Remove</button></td>
      </tr>`;
  }).join("");
}

function renderShoppingCart() {
  setActiveNavigation("shopping-cart");
  if (!cart.size) {
    main.innerHTML = `
      ${pageHeader("Your shopping cart", "Your selected fruit will be collected here.", "Your basket")}
      <section class="empty-state">
        <div class="empty-icon" aria-hidden="true">🧺</div>
        <h2>Your cart is empty</h2>
        <p>Browse the fruit stand and add something fresh.</p>
        <a class="button" href="#/products">Browse Products</a>
      </section>`;
    return;
  }

  main.innerHTML = `
    ${pageHeader("Your shopping cart", "Review your fruit and update quantities before checkout.", "Your basket")}
    ${renderNotice()}
    <section class="panel">
      <div class="cart-table-wrap">
        <table class="cart-table">
          <thead><tr><th scope="col">Product</th><th scope="col">Quantity</th><th scope="col">Line total</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead>
          <tbody>${cartRows()}</tbody>
        </table>
      </div>
      <div class="cart-total"><span>Cart total</span><span>${money(totalCents())}</span></div>
      <div class="cart-actions">
        <a class="button button-secondary" href="#/products">Continue Shopping</a>
        <a class="button" href="#/checkout">Proceed to Checkout</a>
      </div>
    </section>`;
}

function checkoutRows() {
  return [...cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return "";
    return `
      <li class="checkout-item">
        <div class="checkout-item-name">
          <span aria-hidden="true">${product.emoji}</span>
          <span>${escapeHtml(product.name)}<span class="checkout-item-detail">${quantity} × ${money(product.priceCents)} ${escapeHtml(product.unit)}</span></span>
        </div>
        <strong>${money(product.priceCents * quantity)}</strong>
      </li>`;
  }).join("");
}

function renderCheckout() {
  setActiveNavigation("checkout");
  if (orderCompleted) {
    main.innerHTML = `
      ${pageHeader("Order complete", "Thanks for trying the Fruit Shop prototype.", "All done")}
      <section class="confirmation" role="status">
        <div class="confirmation-icon" aria-hidden="true">✅</div>
        <h2>Your sample order has been processed.</h2>
        <p>No payment was taken. This was a local prototype demonstration.</p>
        <a class="button" href="#/products">Continue Shopping</a>
      </section>`;
    return;
  }
  if (!cart.size) {
    main.innerHTML = `
      ${pageHeader("Checkout", "Review your order before completing your sample checkout.", "Almost there")}
      <section class="empty-state">
        <div class="empty-icon" aria-hidden="true">🧺</div>
        <h2>Your cart is empty</h2>
        <p>Add some fruit before heading to checkout.</p>
        <a class="button" href="#/products">Browse Products</a>
      </section>`;
    return;
  }

  main.innerHTML = `
    ${pageHeader("Checkout", "Review your order before completing your sample checkout.", "Almost there")}
    ${renderNotice()}
    <section class="panel">
      <h2>Order summary</h2>
      <ul class="checkout-list">${checkoutRows()}</ul>
      <div class="checkout-total"><span>Order total</span><span>${money(totalCents())}</span></div>
      <button class="button" type="button" data-action="process-order">Process Order</button>
    </section>`;
}

function render() {
  cartCount.textContent = String(itemCount());
  const { page, productId } = currentRoute();
  if (page === "product-details") renderProductDetails(productId);
  else if (page === "shopping-cart") renderShoppingCart();
  else if (page === "checkout") renderCheckout();
  else renderProducts();
}

function setQuantity(input, quantity, minimum = 1) {
  if (!Number.isInteger(quantity) || quantity < minimum) return false;
  input.value = String(quantity);
  return true;
}

function addToCart(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    notice = "Choose a quantity of at least 1.";
    render();
    return;
  }
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  cart.set(productId, (cart.get(productId) || 0) + quantity);
  orderCompleted = false;
  notice = `${product.name} added to your cart.`;
  render();
}

function updateCartQuantity(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0) return false;
  if (quantity === 0) cart.delete(productId);
  else cart.set(productId, quantity);
  orderCompleted = false;
  return true;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, productId } = button.dataset;
  if (action === "step-product") {
    const input = document.querySelector(`[data-product-quantity="${productId}"]`);
    if (input) {
      const quantity = Number(input.value) + Number(button.dataset.step);
      if (setQuantity(input, quantity)) productQuantities.set(productId, quantity);
    }
  } else if (action === "step-detail") {
    const input = document.querySelector("[data-detail-quantity]");
    if (input) {
      const quantity = Number(input.value) + Number(button.dataset.step);
      if (setQuantity(input, quantity)) productQuantities.set(input.dataset.detailQuantity, quantity);
    }
  } else if (action === "step-cart") {
    const input = document.querySelector(`[data-cart-quantity="${productId}"]`);
    if (input) {
      const nextQuantity = Number(input.value) + Number(button.dataset.step);
      if (updateCartQuantity(productId, nextQuantity)) render();
    }
  } else if (action === "add-to-cart") {
    const input = document.querySelector(`[data-product-quantity="${productId}"]`);
    addToCart(productId, input ? input.valueAsNumber : 1);
  } else if (action === "add-detail-to-cart") {
    const input = document.querySelector("[data-detail-quantity]");
    addToCart(productId, input ? input.valueAsNumber : 1);
  } else if (action === "remove") {
    const product = products.find((item) => item.id === productId);
    cart.delete(productId);
    orderCompleted = false;
    notice = product ? `${product.name} removed from your cart.` : "";
    render();
  } else if (action === "process-order") {
    if (cart.size) {
      cart.clear();
      notice = "";
      orderCompleted = true;
      render();
      main.focus();
    }
  }
});

document.addEventListener("change", (event) => {
  const input = event.target;
  if (input.matches("[data-product-quantity]")) {
    const quantity = input.valueAsNumber;
    if (setQuantity(input, quantity)) productQuantities.set(input.dataset.productQuantity, quantity);
    else input.value = String(productQuantities.get(input.dataset.productQuantity) || 1);
  } else if (input.matches("[data-detail-quantity]")) {
    const quantity = input.valueAsNumber;
    if (setQuantity(input, quantity)) productQuantities.set(input.dataset.detailQuantity, quantity);
    else input.value = String(productQuantities.get(input.dataset.detailQuantity) || 1);
  } else if (input.matches("[data-cart-quantity]")) {
    const productId = input.dataset.cartQuantity;
    const quantity = input.valueAsNumber;
    if (updateCartQuantity(productId, quantity)) {
      notice = quantity === 0 ? "Item removed from your cart." : "";
      render();
    } else {
      input.value = String(cart.get(productId) || 1);
    }
  }
});

window.addEventListener("hashchange", () => {
  notice = "";
  render();
});

if (!window.location.hash) {
  window.location.hash = "#/products";
} else {
  render();
}
