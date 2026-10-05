document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==================== STORAGE HELPERS ====================

    const CART_KEY = "nateva_cart";
    const WISHLIST_KEY = "nateva_wishlist";

    function loadStorage(key, fallback) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Storage may be unavailable in some browser modes.
        }
    }

    let cart = loadStorage(CART_KEY, []);
    let wishlist = loadStorage(WISHLIST_KEY, []);

    // ==================== DOM ====================

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartFooter = document.getElementById("cartFooter");
    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const toastElement = document.getElementById("natevaToast");
    const toastText = document.getElementById("toastText");
    const emptyProducts = document.getElementById("emptyProducts");

    const toast = toastElement && typeof bootstrap !== "undefined"
        ? new bootstrap.Toast(toastElement, { delay: 2200 })
        : null;

    // ==================== FORMAT PRICE ====================

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(value);
    }

    // ==================== TOAST ====================

    function showToast(message) {
        if (toastText) {
            toastText.textContent = message;
        }
        if (toast) {
            toast.show();
        }
    }

    // ==================== CART ====================

    function getCartQuantity() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    function getCartSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCartCounter() {
        const quantity = getCartQuantity();

        if (cartCount) {
            cartCount.textContent = quantity;
            cartCount.classList.toggle("d-none", quantity === 0);
        }
    }

    function renderCart() {
        if (!cartItems || !emptyCart || !cartFooter) return;

        cartItems.innerHTML = "";

        if (cart.length === 0) {
            emptyCart.classList.remove("d-none");
            cartFooter.classList.add("d-none");
        } else {
            emptyCart.classList.add("d-none");
            cartFooter.classList.remove("d-none");

            cart.forEach((item) => {
                const itemElement = document.createElement("div");
                itemElement.className = "cart-item";

                itemElement.innerHTML = `
                    <img class="cart-item-image" src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <strong>${formatRupiah(item.price)}</strong>
                        <div class="cart-qty">
                            <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Kurangi jumlah">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Tambah jumlah">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-cart" type="button" data-action="remove" data-id="${item.id}" aria-label="Hapus ${item.name}">
                        <i class="bi bi-trash3"></i>
                    </button>
                `;

                cartItems.appendChild(itemElement);
            });
        }

        if (cartSubtotal) {
            cartSubtotal.textContent = formatRupiah(getCartSubtotal());
        }

        updateCartCounter();
    }

    function addToCart(product) {
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                quantity: 1
            });
        }

        saveStorage(CART_KEY, cart);
        renderCart();
        showToast(`${product.name} added to your bag.`);
    }

    function changeQuantity(id, change) {
        const item = cart.find((product) => product.id === id);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter((product) => product.id !== id);
        }

        saveStorage(CART_KEY, cart);
        renderCart();
    }

    function removeFromCart(id) {
        const item = cart.find((product) => product.id === id);
        cart = cart.filter((product) => product.id !== id);

        saveStorage(CART_KEY, cart);
        renderCart();

        if (item) {
            showToast(`${item.name} removed from your bag.`);
        }
    }

    document.querySelectorAll(".add-cart-btn").forEach((button) => {
        button.addEventListener("click", () => {
            addToCart({
                id: button.dataset.id,
                name: button.dataset.name,
                price: button.dataset.price,
                image: button.dataset.image
            });
        });
    });

    if (cartItems) {
        cartItems.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (!button) return;

            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === "increase") changeQuantity(id, 1);
            if (action === "decrease") changeQuantity(id, -1);
            if (action === "remove") removeFromCart(id);
        });
    }

    // ==================== WISHLIST ====================

    function updateWishlistCounter() {
        const count = wishlist.length;

        if (wishlistCount) {
            wishlistCount.textContent = count;
            wishlistCount.classList.toggle("d-none", count === 0);
        }

        document.querySelectorAll(".favorite-btn").forEach((button) => {
            const id = button.dataset.wishlistId;
            const icon = button.querySelector("i");
            const active = wishlist.includes(id);

            button.classList.toggle("is-favorite", active);

            if (icon) {
                icon.classList.toggle("bi-heart-fill", active);
                icon.classList.toggle("bi-heart", !active);
            }
        });
    }

    document.querySelectorAll(".favorite-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.wishlistId;

            if (wishlist.includes(id)) {
                wishlist = wishlist.filter((item) => item !== id);
                showToast("Removed from your wishlist.");
            } else {
                wishlist.push(id);
                showToast("Added to your wishlist.");
            }

            saveStorage(WISHLIST_KEY, wishlist);
            updateWishlistCounter();
        });
    });

    // ==================== PRODUCT FILTER ====================

    const filterButtons = document.querySelectorAll(".filter-btn");
    const productItems = document.querySelectorAll(".product-item");

    function applyFilter(category) {
        let visible = 0;

        productItems.forEach((item) => {
            const show = category === "all" || item.dataset.category === category;
            item.classList.toggle("d-none", !show);

            if (show) visible++;
        });

        if (emptyProducts) {
            emptyProducts.classList.toggle("d-none", visible !== 0);
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            applyFilter(button.dataset.filter);
        });
    });

    document.querySelectorAll(".category-card").forEach((card) => {
        card.addEventListener("click", () => {
            const category = card.dataset.category;
            const targetButton = document.querySelector(
                `.filter-btn[data-filter="${category}"]`
            );

            if (targetButton) {
                targetButton.click();
            }

            document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
        });
    });

    // ==================== SEARCH ====================

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    let searchModal = null;

    if (searchButton && typeof bootstrap !== "undefined") {
        const modalElement = document.getElementById("searchModal");
        searchModal = new bootstrap.Modal(modalElement);

        searchButton.addEventListener("click", () => {
            searchModal.show();
            setTimeout(() => searchInput?.focus(), 300);
        });
    }

    function performSearch(query) {
        if (!searchResults) return;

        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            searchResults.innerHTML = "";
            return;
        }

        const matches = Array.from(productItems).filter((item) => {
            const name = item.dataset.name?.toLowerCase() || "";
            const category = item.dataset.category?.toLowerCase() || "";
            return name.includes(normalized) || category.includes(normalized);
        });

        if (matches.length === 0) {
            searchResults.innerHTML = `
                <div class="py-3">
                    <p class="mb-0 text-muted small">No products match your search.</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = matches.map((item) => {
            const image = item.querySelector(".product-image")?.src || "";
            const name = item.dataset.name || "Product";
            const category = item.dataset.category || "";

            return `
                <button type="button" class="search-result w-100 text-start bg-transparent border-0"
                        data-search-product="${name}">
                    <img src="${image}" alt="${name}">
                    <span>
                        <strong>${name}</strong>
                        <small>${category}</small>
                    </span>
                </button>
            `;
        }).join("");
    }

    searchInput?.addEventListener("input", () => {
        performSearch(searchInput.value);
    });

    searchResults?.addEventListener("click", (event) => {
        const result = event.target.closest("[data-search-product]");
        if (!result) return;

        const name = result.dataset.searchProduct;
        const item = Array.from(productItems).find(
            (product) => product.dataset.name === name
        );

        if (item) {
            const category = item.dataset.category;
            const filterButton = document.querySelector(
                `.filter-btn[data-filter="${category}"]`
            );

            filterButton?.click();
            searchModal?.hide();

            setTimeout(() => {
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
            }, 250);
        }
    });

    // ==================== NEWSLETTER ====================

    const newsletterForm = document.getElementById("newsletterForm");

    newsletterForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("emailInput")?.value.trim();

        if (email) {
            showToast("You're on the list. Welcome to NATEVA.");
            newsletterForm.reset();
        }
    });

    // ==================== CHECKOUT DEMO ====================

    document.getElementById("checkoutButton")?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Your bag is empty.");
            return;
        }

        showToast("Checkout is ready for the next step.");
    });

    // ==================== MOBILE NAV ====================

    const navMenu = document.getElementById("navMenu");

    document.querySelectorAll("#navMenu .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (
                navMenu?.classList.contains("show") &&
                typeof bootstrap !== "undefined"
            ) {
                const collapse = bootstrap.Collapse.getInstance(navMenu)
                    || new bootstrap.Collapse(navMenu, { toggle: false });

                collapse.hide();
            }
        });
    });

    // ==================== ACTIVE NAV ON SCROLL ====================

    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    const sections = Array.from(navLinks)
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach((section) => observer.observe(section));

    // ==================== INITIALIZE ====================

    renderCart();
    updateWishlistCounter();
});
