import { useState } from "react";
import { ArrowLeft, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/CustomerOrders.css";

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatOrderDate(order) {
  const date = order.createdAt ? new Date(order.createdAt) : new Date(order.date);
  return Number.isNaN(date.getTime())
    ? order.date || "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
}

export default function CustomerOrders({ orders, onCancelOrder }) {
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  function openCancellation(orderId) {
    setCancellingOrderId(orderId);
    setCancellationReason("");
  }

  function submitCancellation(event, orderId) {
    event.preventDefault();
    const reason = cancellationReason.trim();
    if (!reason) return;

    onCancelOrder(orderId, reason);
    setCancellingOrderId(null);
    setCancellationReason("");
  }

  return (
    <main className="customer-orders-page container page-enter">
      <Link to="/profile" className="customer-orders-back">
        <ArrowLeft size={17} /> Back to account
      </Link>

      <header className="customer-orders-heading">
        <span className="customer-orders-eyebrow">YOUR ACCOUNT</span>
        <h1>My orders</h1>
        <p>Review your order items, delivery details, and order status.</p>
      </header>

      {orders.length === 0 ? (
        <section className="customer-orders-empty">
          <span><ShoppingBag size={25} /></span>
          <h2>No orders yet</h2>
          <p>Your orders and delivery details will appear here after checkout.</p>
          <Link className="primary-btn" to="/products">Explore products</Link>
        </section>
      ) : (
        <section className="customer-orders-list" aria-label="Your orders">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const cancelled = order.status === "Cancelled";
            const itemCount = items.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0
            );

            return (
              <article
                className={`customer-order-card${cancelled ? " is-cancelled" : ""}`}
                key={order.id}
              >
                <header className="customer-order-heading">
                  <div>
                    <span className="customer-orders-eyebrow">ORDER</span>
                    <h2>{order.id}</h2>
                    <p>{formatOrderDate(order)}</p>
                  </div>
                  <span className={`customer-order-status${cancelled ? " cancelled" : ""}`}>
                    {order.status || "Order placed"}
                  </span>
                </header>

                {cancelled ? (
                  <div className="customer-order-cancellation">
                    <strong>Cancellation reason</strong>
                    <p>{order.cancellationReason || "No reason was provided."}</p>
                  </div>
                ) : (
                  <div className="customer-order-cancel-area">
                    {cancellingOrderId === order.id ? (
                      <form onSubmit={(event) => submitCancellation(event, order.id)}>
                        <label htmlFor={`cancel-reason-${order.id}`}>
                          Why are you cancelling this order?
                        </label>
                        <textarea
                          id={`cancel-reason-${order.id}`}
                          value={cancellationReason}
                          onChange={(event) => setCancellationReason(event.target.value)}
                          placeholder="Please tell us the reason"
                          maxLength={500}
                          rows={3}
                          required
                          autoFocus
                        />
                        <div className="customer-order-cancel-actions">
                          <button
                            type="button"
                            className="customer-order-cancel-dismiss"
                            onClick={() => setCancellingOrderId(null)}
                          >
                            Keep order
                          </button>
                          <button
                            type="submit"
                            className="customer-order-cancel-confirm"
                            disabled={!cancellationReason.trim()}
                          >
                            Confirm cancellation
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className="customer-order-cancel-button"
                        onClick={() => openCancellation(order.id)}
                      >
                        Cancel order
                      </button>
                    )}
                  </div>
                )}

                <div className="customer-order-items">
                  {items.map((item, index) => {
                    const quantity = Number(item.quantity) || 0;
                    const unitPrice = Number(item.price) || 0;
                    return (
                      <div
                        className="customer-order-item"
                        key={`${order.id}-${item.id}-${index}`}
                      >
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <div className="customer-order-product">
                          <strong>{item.name}</strong>
                          <span>
                            {item.size ? `Size ${item.size}` : "Standard size"}
                            {item.color ? ` · ${item.color}` : ""}
                          </span>
                          <span>{formatCurrency(unitPrice)} each · Qty {quantity}</span>
                        </div>
                        <strong className="customer-order-line-total">
                          {formatCurrency(unitPrice * quantity)}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                {order.shippingAddress && (
                  <div className="customer-order-delivery">
                    <strong><MapPin size={15} /> Delivery details</strong>
                    <span>{order.shippingAddress.name}</span>
                    <span><Phone size={14} /> {order.shippingAddress.phone}</span>
                    <span>{order.shippingAddress.address}</span>
                    <span>PIN code: {order.shippingAddress.pincode}</span>
                  </div>
                )}

                <footer className="customer-order-footer">
                  <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                  <strong>Total: {formatCurrency(Number(order.total) || 0)}</strong>
                </footer>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
