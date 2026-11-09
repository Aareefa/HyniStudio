import { useEffect, useState } from "react";
import Home from "./pages/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Products from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import Wishlist from "./pages/Wishlist";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminWorkers from "./pages/AdminWorkers";
import Checkout from "./pages/Checkout";
import CustomerOrders from "./pages/CustomerOrders";
import ChatSupport from "./pages/ChatSupport";
import ChatLauncher from "./Components/ChatLauncher";
import WorkerDashboard from "./pages/WorkerDashboard";

import initialProducts from "./data/products";
import { WHOLESALE_MINIMUM_ORDER } from "./data/orderRules";
import { logoutWorkerAccount } from "./utils/authApi";
import "./App.css";

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function createInitialInventory(products, orders) {
  return products.map((product) => {
    const received = 8 + ((product.id * 7) % 17);
    const sold = orders
      .filter((order) => order.status !== "Cancelled")
      .flatMap((order) => order.items || [])
      .filter((item) => item.id === product.id)
      .reduce((quantity, item) => quantity + (Number(item.quantity) || 0), 0);

    return {
      productId: product.id,
      received,
      sold: Math.min(sold, received),
      damaged: 0
    };
  });
}

function readInventory(products, orders) {
  const initialInventory = createInitialInventory(products, orders);
  const savedInventory = readSaved("hyni-inventory", null);

  if (!Array.isArray(savedInventory)) return initialInventory;

  const activeProductIds = new Set(products.map((product) => product.id));
  const activeSavedInventory = savedInventory.filter((item) =>
    activeProductIds.has(item.productId)
  );
  const savedProductIds = new Set(
    activeSavedInventory.map((item) => item.productId)
  );
  return [
    ...activeSavedInventory,
    ...initialInventory.filter((item) => !savedProductIds.has(item.productId))
  ];
}

function StoreApp() {
  const navigate = useNavigate();
  const [products] = useState(initialProducts);
  const [user, setUser] = useState(() => readSaved("hyni-user", null));
  const [cart, setCart] = useState(() => readSaved("hyni-cart", []));
  const [wishlist, setWishlist] = useState(() =>
    readSaved("hyni-wishlist", [])
  );
  const [orders, setOrders] = useState(() => readSaved("hyni-orders", []));
  const [inventory, setInventory] = useState(() =>
    readInventory(initialProducts, readSaved("hyni-orders", []))
  );
  const [productCosts, setProductCosts] = useState(() =>
    readSaved("hyni-product-costs", {})
  );
  const [shippingAddresses, setShippingAddresses] = useState(() =>
    readSaved("hyni-shipping-addresses", {})
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("hyni-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("hyni-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("hyni-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("hyni-orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("hyni-inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("hyni-product-costs", JSON.stringify(productCosts));
  }, [productCosts]);

  useEffect(() => {
    localStorage.setItem("hyni-shipping-addresses", JSON.stringify(shippingAddresses));
  }, [shippingAddresses]);

  function handleLogin(account) {
    setUser(account);
  }

  function handleSignup(account) {
    setUser(account);
  }

  async function handleLogout() {
    try {
      if (user?.role === "Worker" && user.sessionToken) {
        await logoutWorkerAccount(user.sessionToken);
      }
      setUser(null);
      navigate("/");
    } catch (error) {
      window.alert(error.message);
    }
  }

  function addToCart(product, size, color) {
    const chosenSize = size || product.sizes[0];
    const chosenColor = color || product.colors[0];
    const currentSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const nextSubtotal = currentSubtotal + product.price;

    setCart((old) => {
      const existing = old.find(
        (item) =>
          item.id === product.id &&
          item.size === chosenSize &&
          item.color === chosenColor
      );

      if (existing) {
        return old.map((item) =>
          item.cartId === existing.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...old,
        {
          ...product,
          cartId: `${product.id}-${Date.now()}-${Math.random()}`,
          size: chosenSize,
          color: chosenColor,
          quantity: 1
        }
      ];
    });

    if (user?.role === "Wholesaler") {
      const amountRemaining = Math.max(0, WHOLESALE_MINIMUM_ORDER - nextSubtotal);
      window.alert(
        `${product.name} added to your shopping bag. Wholesale minimum order: ₹${WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")}.${amountRemaining > 0 ? ` Add ₹${amountRemaining.toLocaleString("en-IN")} more to place your order.` : " Your bag meets the minimum order."}`
      );
      return;
    }

    window.alert(`${product.name} added to your shopping bag.`);
  }

  function toggleWishlist(id) {
    if (!user) {
      window.alert("Please sign in to save your wishlist.");
      return;
    }

    setWishlist((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  }

  function updateQuantity(cartId, change) {
    setCart((old) =>
      old
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(cartId) {
    setCart((old) => old.filter((item) => item.cartId !== cartId));
  }

  function startCheckout() {
    if (!user) {
      window.alert("Please sign in before placing an order.");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (user.role === "Wholesaler" && total < WHOLESALE_MINIMUM_ORDER) {
      window.alert(
        `Wholesale orders require a minimum total of ₹${WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")}.`
      );
      return;
    }

    const insufficientStock = cart.some((item) => {
      const stock = inventory.find((entry) => entry.productId === item.id);
      return stock && item.quantity > stock.received - stock.sold - stock.damaged;
    });

    if (insufficientStock) {
      window.alert("There is not enough stock to complete this order.");
      return;
    }

    navigate("/checkout");
  }

  function checkout(shippingAddress) {
    if (!user || cart.length === 0) {
      navigate(user ? "/cart" : "/login");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (user.role === "Wholesaler" && total < WHOLESALE_MINIMUM_ORDER) {
      window.alert(
        `Wholesale orders require a minimum total of ₹${WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")}.`
      );
      navigate("/cart");
      return;
    }

    const insufficientStock = cart.some((item) => {
      const stock = inventory.find((entry) => entry.productId === item.id);
      return stock && item.quantity > stock.received - stock.sold - stock.damaged;
    });
    if (insufficientStock) {
      window.alert("There is not enough stock to complete this order.");
      navigate("/cart");
      return;
    }

    const addressKey = (user.email || user.name).trim().toLowerCase();
    const savedAddress = shippingAddresses[addressKey];
    const orderAddress = savedAddress || shippingAddress;
    if (
      !orderAddress?.name ||
      !orderAddress.phone ||
      !orderAddress.address ||
      !orderAddress.pincode
    ) {
      navigate("/checkout");
      return;
    }

    const order = {
      id: `HFS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-IN"),
      customerName: orderAddress.name,
      customerEmail: user.email,
      shippingAddress: orderAddress,
      items: cart,
      total,
      status: "Demo order placed"
    };

    setInventory((old) =>
      old.map((stock) => {
        const soldFromProduct = cart
          .filter((item) => item.id === stock.productId)
          .reduce((quantity, item) => quantity + item.quantity, 0);

        return { ...stock, sold: stock.sold + soldFromProduct };
      })
    );
    setOrders((old) => [order, ...old]);
    setCart([]);
    if (!savedAddress) {
      setShippingAddresses((old) => ({ ...old, [addressKey]: orderAddress }));
    }
    navigate("/orders");
  }

  function cancelOrder(orderId, reason) {
    const customerEmail = user?.email?.trim().toLowerCase();
    const order = orders.find(
      (item) =>
        item.id === orderId &&
        item.customerEmail?.trim().toLowerCase() === customerEmail
    );
    const cancellationReason = reason.trim();

    if (!order || order.status === "Cancelled" || !cancellationReason) return;

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: "Cancelled",
              cancellationReason,
              cancelledAt: new Date().toISOString()
            }
          : item
      )
    );
    setInventory((current) =>
      current.map((stock) => {
        const cancelledQuantity = (order.items || [])
          .filter((item) => item.id === stock.productId)
          .reduce((total, item) => total + (Number(item.quantity) || 0), 0);

        return {
          ...stock,
          sold: Math.max(0, stock.sold - cancelledQuantity)
        };
      })
    );
  }

  function restockProduct(productId) {
    setInventory((old) =>
      old.map((stock) =>
        stock.productId === productId
          ? { ...stock, received: stock.received + 1 }
          : stock
      )
    );
  }

  function markProductDamaged(productId) {
    setInventory((old) =>
      old.map((stock) => {
        if (stock.productId !== productId) return stock;

        const available = stock.received - stock.sold - stock.damaged;
        return available > 0
          ? { ...stock, damaged: stock.damaged + 1 }
          : stock;
      })
    );
  }

  return (
    <>
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onSearch={(query) => {
          setSearchTerm(query.trim());
          window.location.href = "/products";
        }}
      />

      <Routes>
        <Route
          path="/worker"
          element={
            user?.role === "Worker" ? (
              <WorkerDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/"
          element={
            <Home
              products={products}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onAdd={addToCart}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="/chat"
          element={<ChatSupport user={user} products={products} />}
        />

        <Route
          path="/signup"
          element={
            <Signup
              onSignup={handleSignup}
            />
          }
        />

        <Route
          path="/products"
          element={
            <Products
              products={products}
              user={user}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onAdd={addToCart}
              searchTerm={searchTerm}
            />
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              products={products}
              user={user}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onAdd={addToCart}
            />
          }
        />

        <Route
          path="/category/:categorySlug"
          element={
            <CategoryProducts
              products={products}
              user={user}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onAdd={addToCart}
              searchTerm={searchTerm}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              user={user}
              onQuantity={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={startCheckout}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <Checkout
                user={user}
                cart={cart}
                savedAddress={shippingAddresses[(user.email || user.name).trim().toLowerCase()]}
                onPlaceOrder={checkout}
              />
            )
          }
        />

        <Route
          path="/wishlist"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <Wishlist
                products={products}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                onAdd={addToCart}
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <main className="profile-page container page-enter">
                <h1>My account</h1>
                <p>Welcome, {user.name}!</p>
                <p>Account type: {user.role}</p>
                <p>Email: {user.email}</p>

                <div className="profile-actions">
                  <Link className="primary-btn" to="/products">
                    Continue shopping
                  </Link>

                  <Link className="outline-btn" to="/cart">
                    My shopping bag
                  </Link>

                  {(user.role === "Customer" || user.role === "Wholesaler") && (
                    <Link className="outline-btn" to="/orders">
                      My orders
                    </Link>
                  )}

                  <button
                    className="outline-btn"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </main>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/orders"
          element={
            user?.role === "Customer" || user?.role === "Wholesaler" ? (
              <CustomerOrders
                orders={orders.filter(
                  (order) =>
                    order.customerEmail?.trim().toLowerCase() ===
                    user.email?.trim().toLowerCase()
                )}
                onCancelOrder={cancelOrder}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user?.role === "Admin" ? (
              <AdminDashboard
                user={user}
                products={products}
                orders={orders}
                inventory={inventory}
                productCosts={productCosts}
                onRestock={restockProduct}
                onMarkDamaged={markProductDamaged}
                onUpdateProductCost={(productId, cost) =>
                  setProductCosts((current) => ({ ...current, [productId]: cost }))
                }
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/orders"
          element={
            user?.role === "Admin" ? (
              <AdminOrders orders={orders} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/workers"
          element={
            user?.role === "Admin" && user.sessionToken ? (
              <AdminWorkers user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ChatLauncher />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreApp />
    </BrowserRouter>
  );
}