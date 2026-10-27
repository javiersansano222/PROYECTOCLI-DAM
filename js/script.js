const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartEmptyLink = document.getElementById("cartEmptyLink");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const productGrid = document.getElementById("productGrid");
const filters = document.querySelectorAll(".filter");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const productsEmpty = document.getElementById("productsEmpty");
const productModal = document.getElementById("productModal");
const productModalImage = document.getElementById("productModalImage");
const productModalCat = document.getElementById("productModalCat");
const productModalTitle = document.getElementById("productModalTitle");
const productModalPrice = document.getElementById("productModalPrice");
const productModalDesc = document.getElementById("productModalDesc");
const productModalAdd = document.getElementById("productModalAdd");
const productModalClose = productModal.querySelector(".product-modal-close");

const STORAGE_KEY = "atelier-roble-cart";
const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

let cart = loadCart();
let lastFocused = null;
let lastModalFocused = null;
let currentModalProduct = null;
let modalCloseTimer = null;
let toastTimer = null;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => item && item.id && Number(item.price) > 0 && Number(item.qty) > 0);
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function totalItems() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function totalPrice() {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => element.offsetParent !== null);
}

function trapFocus(container, event) {
  if (event.key !== "Tab") return;
  const focusable = getFocusable(container);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openProductModal(trigger) {
  const card = trigger.closest(".product-card");
  if (!card) return;
  const addButton = card.querySelector(".product-add");
  if (!addButton) return;

  closeMenu();
  currentModalProduct = {
    id: addButton.dataset.id,
    name: addButton.dataset.name,
    price: Number(addButton.dataset.price),
    image: addButton.dataset.image
  };

  productModalImage.src = addButton.dataset.image;
  productModalImage.alt = addButton.dataset.name;
  productModalCat.textContent = card.querySelector(".product-cat").textContent;
  productModalTitle.textContent = addButton.dataset.name;
  productModalPrice.textContent = euro.format(currentModalProduct.price);
  productModalDesc.textContent = addButton.dataset.desc || "";

  lastModalFocused = document.activeElement;
  window.clearTimeout(modalCloseTimer);
  productModal.hidden = false;
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.requestAnimationFrame(() => productModal.classList.add("is-open"));
  window.setTimeout(() => productModalClose.focus(), 60);
}

function closeProductModal(restoreFocus = true) {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.clearTimeout(modalCloseTimer);
  modalCloseTimer = window.setTimeout(() => {
    productModal.hidden = true;
  }, 380);
  if (restoreFocus && lastModalFocused) {
    lastModalFocused.focus();
  }
}

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

function openMenu() {
  closeCart(false);
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Cerrar menú");
  mainNav.classList.add("is-open");
  header.classList.add("menu-active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  mainNav.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
  } else {
    openMenu();
  }
}

function openCart() {
  closeMenu();
  lastFocused = document.activeElement;
  cartOverlay.hidden = false;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("cart-open");
  window.requestAnimationFrame(() => cartOverlay.classList.add("is-visible"));
  window.setTimeout(() => cartClose.focus(), 120);
}

function closeCart(restoreFocus = true) {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartToggle.setAttribute("aria-expanded", "false");
  cartOverlay.classList.remove("is-visible");
  document.body.classList.remove("cart-open");
  window.setTimeout(() => {
    cartOverlay.hidden = true;
  }, 450);
  if (restoreFocus && lastFocused) {
    lastFocused.focus();
  }
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} añadido a tu selección`);
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function buildCartItem(item) {
  const article = document.createElement("article");
  article.className = "cart-item";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.name;
  image.loading = "lazy";

  const info = document.createElement("div");
  info.className = "cart-item-info";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const price = document.createElement("p");
  price.className = "cart-item-price";
  price.textContent = euro.format(item.price);

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";

  const qty = document.createElement("div");
  qty.className = "qty-control";

  const minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", `Quitar una unidad de ${item.name}`);
  minus.dataset.action = "decrease";
  minus.dataset.id = item.id;

  const amount = document.createElement("span");
  amount.textContent = item.qty;
  amount.setAttribute("aria-label", `Cantidad: ${item.qty}`);

  const plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `Añadir una unidad de ${item.name}`);
  plus.dataset.action = "increase";
  plus.dataset.id = item.id;

  qty.append(minus, amount, plus);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "cart-remove";
  remove.textContent = "Eliminar";
  remove.dataset.action = "remove";
  remove.dataset.id = item.id;

  controls.append(qty, remove);
  info.append(title, price, controls);
  article.append(image, info);
  return article;
}

function renderCart() {
  cartItemsEl.replaceChildren();
  cart.forEach((item) => cartItemsEl.append(buildCartItem(item)));

  const count = totalItems();
  cartCount.textContent = count;
  cartSubtotal.textContent = euro.format(totalPrice());
  cartCount.setAttribute("aria-label", `${count} artículos en el carrito`);

  const isEmpty = cart.length === 0;
  cartEmpty.classList.toggle("is-visible", isEmpty);
  cartFooter.style.display = isEmpty ? "none" : "";
  cartItemsEl.style.display = isEmpty ? "none" : "";
}

productGrid.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-product]");
  if (openButton) {
    openProductModal(openButton);
    return;
  }
  const button = event.target.closest(".product-add");
  if (!button) return;
  addToCart({
    id: button.dataset.id,
    name: button.dataset.name,
    price: Number(button.dataset.price),
    image: button.dataset.image
  });
});

productModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-product]")) {
    closeProductModal();
  }
});

productModalAdd.addEventListener("click", () => {
  if (!currentModalProduct) return;
  const product = currentModalProduct;
  closeProductModal(false);
  if (lastModalFocused) lastModalFocused.focus();
  addToCart(product);
});

cartItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "increase") changeQty(id, 1);
  if (action === "decrease") changeQty(id, -1);
  if (action === "remove") removeItem(id);
});

cartToggle.addEventListener("click", () => {
  if (cartDrawer.classList.contains("is-open")) {
    closeCart();
  } else {
    openCart();
  }
});

cartClose.addEventListener("click", () => closeCart());
cartOverlay.addEventListener("click", () => closeCart());

menuToggle.addEventListener("click", toggleMenu);

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

cartEmptyLink.addEventListener("click", () => closeCart());

document.addEventListener("keydown", (event) => {
  if (productModal.classList.contains("is-open")) {
    trapFocus(productModal, event);
    if (event.key === "Escape") closeProductModal();
    return;
  }
  if (cartDrawer.classList.contains("is-open")) {
    trapFocus(cartDrawer, event);
    if (event.key === "Escape") closeCart();
    return;
  }
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (
    menuToggle.getAttribute("aria-expanded") === "true" &&
    !mainNav.contains(event.target) &&
    !menuToggle.contains(event.target) &&
    !header.querySelector(".brand").contains(event.target)
  ) {
    closeMenu();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) return;
  const total = euro.format(totalPrice());
  showToast(`Pedido de demostración preparado por ${total}. ¡Gracias!`);
  cart = [];
  saveCart();
  renderCart();
  window.setTimeout(() => closeCart(), 600);
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
    filter.classList.add("is-active");
    filter.setAttribute("aria-pressed", "true");

    const category = filter.dataset.filter;
    let visible = 0;
    document.querySelectorAll(".product-card").forEach((card) => {
      const matches = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !matches);
      if (matches) visible += 1;
    });
    productsEmpty.hidden = visible > 0;
  });
});

productsEmpty.querySelector("[data-reset-filter]").addEventListener("click", () => {
  document.querySelector('.filter[data-filter="all"]').click();
});

const testimonials = Array.from(document.querySelectorAll(".testimonial"));
const sliderDots = document.getElementById("sliderDots");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
let testimonialIndex = 0;
let testimonialTimer = null;

testimonials.forEach((testimonial, index) => {
  const dot = document.createElement("span");
  if (index === 0) dot.classList.add("is-active");
  sliderDots.append(dot);
});

function showTestimonial(index) {
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.toggle("is-active", i === testimonialIndex);
  });
  sliderDots.querySelectorAll("span").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === testimonialIndex);
  });
}

function startTestimonialAutoplay() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(() => {
    showTestimonial(testimonialIndex + 1);
  }, 7000);
}

prevTestimonial.addEventListener("click", () => {
  showTestimonial(testimonialIndex - 1);
  startTestimonialAutoplay();
});

nextTestimonial.addEventListener("click", () => {
  showTestimonial(testimonialIndex + 1);
  startTestimonialAutoplay();
});

document.getElementById("testimonialSlider").addEventListener("mouseenter", () => {
  window.clearInterval(testimonialTimer);
});

document.getElementById("testimonialSlider").addEventListener("mouseleave", startTestimonialAutoplay);

startTestimonialAutoplay();

function setFieldError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("has-error", Boolean(message));
  const error = field.querySelector(".field-error");
  error.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  let valid = true;

  if (name.length < 2) {
    setFieldError(nameInput, "Escribe tu nombre para continuar.");
    valid = false;
  } else {
    setFieldError(nameInput, "");
  }

  if (!isValidEmail(email)) {
    setFieldError(emailInput, "Introduce un correo electrónico válido.");
    valid = false;
  } else {
    setFieldError(emailInput, "");
  }

  if (!valid) {
    formStatus.textContent = "";
    return;
  }

  formStatus.textContent = `Gracias, ${name}. Te enviaremos el catálogo a ${email}.`;
  contactForm.reset();
});

contactForm.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("has-error")) {
      setFieldError(input, "");
    }
  });
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
setHeaderState();
renderCart();
