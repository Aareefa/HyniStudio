import { ArrowLeft, ChevronDown, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/AdminOrders.css";

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getOrderDate(order) {
  const localizedDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(order.date || "");
  const date = order.createdAt
    ? new Date(order.createdAt)
    : localizedDate
      ? new Date(Number(localizedDate[3]), Number(localizedDate[2]) - 1, Number(localizedDate[1]))
      : new Date(order.date);

  return Number.isNaN(date.getTime())
    ? order.date || "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
}

export default function AdminOrders({ orders }) {
  return (
    <main className="admin-orders-page container page-enter">
      <Link className="admin-orders-back" to="/admin">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>

      <header className="admin-orders-page-heading">
        <div>
          <span className="admin-orders-eyebrow">ORDER MANAGEMENT</span>
          <h1>Customer orders</h1>
          <p>Review order status, customer information, products, and quantities.</p>
        </div>
        <span className="admin-orders-total">
          <ShoppingBag size={17} />
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </header>

      {orders.length === 0 ? (
        <section className="admin-orders-empty">
          <span><ShoppingBag size={25} /></span>
          <h2>No orders yet</h2>
          <p>New customer orders will appear here with their products and quantities.</p>
        </section>
      ) : (
        <section className="admin-orders-list" aria-label="All customer orders">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0
            );

            return (
              <article
                className={`admin-order-detail-card${order.status === "Cancelled" ? " is-cancelled" : ""}`}
                key={order.id}
              >
                <details className="admin-order-details">
                  <summary className="admin-order-summary">
                    <span className="admin-order-summary-id">
                      <span className="admin-orders-eyebrow">ORDER</span>
                      <strong>{order.id}</strong>
                      <small>{getOrderDate(order)}</small>
                    </span>
                    <span className="admin-order-summary-customer">
                      <small>Customer</small>
                      <strong>{order.customerName || "Customer details unavailable"}</strong>
                    </span>
                    <span className="admin-order-summary-count">
                      <small>Items</small>
                      <strong>{itemCount}</strong>
                    </span>
                    <span className={`admin-order-detail-status${order.status === "Cancelled" ? " cancelled" : ""}`}>
                      {order.status || "Order placed"}
                    </span>
                    <span className="admin-order-detail-total">
                      <span>Order total</span>
                      <strong>{formatCurrency(Number(order.total) || 0)}</strong>
                    </span>
                    <ChevronDown className="admin-order-summary-chevron" size={19} aria-hidden="true" />
                  </summary>

                  <div className="admin-order-expanded">
                    <div className="admin-order-detail-meta">
                      <div>
                        <span>Customer</span>
                        <strong>{order.customerName || "Customer details unavailable"}</strong>
                      </div>
                      {order.customerEmail && (
                    <div>
                      <span>Email</span>
                      <strong><Mail size={14} /> {order.customerEmail}</strong>
                    </div>
                      )}
                      {order.shippingAddress?.phone && (
                    <div>
                      <span>Phone</span>
                      <strong><Phone size={14} /> {order.shippingAddress.phone}</strong>
                    </div>
                      )}
                      {order.shippingAddress?.address && (
                    <div className="admin-order-detail-address">
                      <span>Delivery address</span>
                      <strong>
                        <MapPin size={14} />
                        {order.shippingAddress.address}
                      </strong>
                      <small>PIN code: {order.shippingAddress.pincode}</small>
                    </div>
                      )}
                    </div>

                    {order.status === "Cancelled" && (
                      <div className="admin-order-cancellation">
                        <strong>Cancellation reason</strong>
                        <p>{order.cancellationReason || "No reason was provided."}</p>
                      </div>
                    )}

                    <div className="admin-order-detail-items">
                      {items.map((item, index) => {
                        const quantity = Number(item.quantity) || 0;
                        const unitPrice = Number(item.price) || 0;

                        return (
                          <div
                            className="admin-order-detail-item"
                            key={`${order.id}-${item.id}-${index}`}
                          >
                            <img src={item.image} alt={item.name} loading="lazy" />
                            <div className="admin-order-detail-product">
                              <strong>{item.name}</strong>
                              <span>
                                {item.size ? `Size ${item.size}` : "Standard size"}
                                {item.color ? ` · ${item.color}` : ""}
                              </span>
                              <span>Unit price: {formatCurrency(unitPrice)}</span>
                            </div>
                            <span className="admin-order-detail-quantity">Qty {quantity}</span>
                            <strong className="admin-order-detail-line-total">
                              {formatCurrency(unitPrice * quantity)}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
