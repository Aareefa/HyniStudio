import { useState } from "react";
import { ArrowLeft, MapPin, Phone, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/Checkout.css";

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function Checkout({ user, cart, savedAddress, onPlaceOrder }) {
  const [details, setDetails] = useState({
    name: savedAddress?.name || user.name || "",
    phone: savedAddress?.phone || "",
    address: savedAddress?.address || "",
    pincode: savedAddress?.pincode || ""
  });
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  function updateField(event) {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
  }

  function submitOrder(event) {
    event.preventDefault();
    onPlaceOrder(savedAddress || {
      name: details.name.trim(),
      phone: details.phone.trim(),
      address: details.address.trim(),
      pincode: details.pincode.trim()
    });
  }

  return (
    <main className="checkout-page container page-enter">
      <Link to="/cart" className="checkout-back">
        <ArrowLeft size={17} /> Back to bag
      </Link>

      <header className="checkout-heading">
        <span className="checkout-eyebrow">DEMO CHECKOUT</span>
        <h1>Delivery details</h1>
        <p>Enter where you would like your order delivered.</p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-panel checkout-form" onSubmit={submitOrder}>
          <div className="checkout-panel-heading">
            <span className="checkout-panel-icon"><MapPin size={19} /></span>
            <div>
              <h2>Shipping address</h2>
              <p>
                {savedAddress
                  ? "Using the address saved with your first order."
                  : "We’ll save these details for your next order."}
              </p>
            </div>
          </div>

          {savedAddress ? (
            <div className="checkout-saved-address">
              <strong>{savedAddress.name}</strong>
              <span><Phone size={15} /> {savedAddress.phone}</span>
              <span>{savedAddress.address}</span>
              <span>PIN code: {savedAddress.pincode}</span>
            </div>
          ) : (
            <div className="checkout-fields">
              <label>
                <span>Full name</span>
                <span className="checkout-input-wrap">
                  <UserRound size={17} />
                  <input
                    autoComplete="name"
                    name="name"
                    value={details.name}
                    onChange={updateField}
                    placeholder="Name for delivery"
                    maxLength={80}
                    required
                  />
                </span>
              </label>

              <label>
                <span>Phone number</span>
                <span className="checkout-input-wrap">
                  <Phone size={17} />
                  <input
                    type="tel"
                    autoComplete="tel"
                    name="phone"
                    value={details.phone}
                    onChange={updateField}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a 10-digit phone number"
                    required
                  />
                </span>
              </label>

              <label className="checkout-address-field">
                <span>Full address</span>
                <textarea
                  autoComplete="street-address"
                  name="address"
                  value={details.address}
                  onChange={updateField}
                  placeholder="House / flat, street, area, city, state"
                  rows={4}
                  maxLength={300}
                  required
                />
              </label>

              <label>
                <span>PIN code</span>
                <input
                  className="checkout-standard-input"
                  autoComplete="postal-code"
                  name="pincode"
                  value={details.pincode}
                  onChange={updateField}
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  title="Enter a 6-digit PIN code"
                  required
                />
              </label>
            </div>
          )}

          <div className="checkout-demo-note">
            Demo checkout only. No payment will be collected.
          </div>
          <button type="submit" className="primary-btn full-btn checkout-submit">
            Place Demo Order · {formatCurrency(subtotal)}
          </button>
        </form>

        <aside className="checkout-panel checkout-summary">
          <div className="checkout-panel-heading">
            <span className="checkout-panel-icon checkout-summary-icon"><ShoppingBag size={19} /></span>
            <div>
              <h2>Order summary</h2>
              <p>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.cartId}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>Qty {item.quantity}{item.size ? ` · ${item.size}` : ""}</span>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-summary-total">
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
