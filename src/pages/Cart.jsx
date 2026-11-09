import { Link } from "react-router-dom";
import { WHOLESALE_MINIMUM_ORDER } from "../data/orderRules";
import "./Cart.css";

export default function Cart({
  cart = [],
  user,
  onQuantity,
  onRemove,
  onCheckout
}) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isWholesaler = user?.role === "Wholesaler";
  const wholesaleRemaining = Math.max(0, WHOLESALE_MINIMUM_ORDER - subtotal);

  return (
    <main className="container cart-page page-enter">
      <div className="page-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>My Shopping Bag</h1>
        <p>Review your selected products before checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍</div>
          <h2>Your bag is empty</h2>
          <p>Discover something beautiful from our collection.</p>

          <Link to="/products" className="primary-btn">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.cartId}>
                <Link
                  to={`/products/${item.id}`}
                  className="cart-item-image"
                  aria-label={`View ${item.name} details`}
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="cart-item-info">
                  <span className="product-category">{item.category}</span>
                  <h3>{item.name}</h3>

                  <p>Size: {item.size}</p>
                  <p>Colour: {item.color}</p>

                  <p className="product-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="quantity-control">
                    <button
                      onClick={() => onQuantity(item.cartId, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => onQuantity(item.cartId, 1)}
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.cartId)}
                  >
                    Remove
                  </button>
                </div>

                <strong className="cart-line-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-line">
              <span>Items</span>
              <span>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <span>Calculated separately</span>
            </div>

            {isWholesaler && subtotal < WHOLESALE_MINIMUM_ORDER && (
              <div className="wholesale-note">
                Add ₹{wholesaleRemaining.toLocaleString("en-IN")} more to
                reach the ₹{WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")} wholesale minimum.
              </div>
            )}

            {isWholesaler && subtotal >= WHOLESALE_MINIMUM_ORDER && (
              <div className="wholesale-note">
                Your bag meets the ₹{WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")} wholesale minimum.
              </div>
            )}

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="primary-btn full-btn"
              onClick={onCheckout}
              disabled={isWholesaler && subtotal < WHOLESALE_MINIMUM_ORDER}
            >
              Place Demo Order
            </button>

            <p className="demo-notice">
              Demo checkout only. No real payment will be collected.
            </p>

            <Link to="/products" className="continue-link">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}