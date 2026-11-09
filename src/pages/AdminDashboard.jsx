import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  Mail,
  PackageCheck,
  PackagePlus,
  PackageX,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import "../Styles/AdminDashboard.css";

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatChartValue(value) {
  const absoluteValue = Math.abs(value);
  const formattedValue = absoluteValue >= 1000000
    ? `${(absoluteValue / 1000000).toFixed(1)}m`
    : absoluteValue >= 1000
      ? `${(absoluteValue / 1000).toFixed(1)}k`
      : Math.round(absoluteValue).toLocaleString("en-IN");

  return `${value < 0 ? "-" : ""}₹${formattedValue}`;
}

function Barcode({ code }) {
  const bars = useMemo(() => {
    const bits = [...code]
      .map((character) => character.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("0");

    return [...bits].map((bit, index) => ({
      x: index * 2,
      width: bit === "1" ? 2 : 1
    }));
  }, [code]);

  return (
    <span className="admin-barcode">
      <svg
        viewBox={`0 0 ${bars.length * 2} 30`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Barcode for dress code ${code}`}
      >
        {bars.map((bar, index) => (
          <rect key={index} x={bar.x} y="0" width={bar.width} height="30" />
        ))}
      </svg>
      <span>{code}</span>
    </span>
  );
}

function getOrderDate(order) {
  const localizedDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(order.date || "");
  const date = order.createdAt
    ? new Date(order.createdAt)
    : localizedDate
      ? new Date(Number(localizedDate[3]), Number(localizedDate[2]) - 1, Number(localizedDate[1]))
      : new Date(order.date);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getMonthlyProfitLoss(orders, productCosts) {
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (11 - index));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      title: date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      net: 0,
      orders: 0
    };
  });
  const monthsByKey = new Map(months.map((month) => [month.key, month]));
  let uncostedOrders = 0;

  orders.forEach((order) => {
    if (order.status === "Cancelled") return;

    const date = getOrderDate(order);
    if (!date) return;

    const month = monthsByKey.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (!month) return;

    const items = Array.isArray(order.items) ? order.items : [];
    if (
      items.length === 0 ||
      items.some((item) => {
        const cost = productCosts[item.id];
        return cost === undefined || cost === null || cost === "" || !Number.isFinite(Number(cost));
      })
    ) {
      uncostedOrders += 1;
      return;
    }

    const orderRevenue = items.reduce(
      (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    const orderCost = items.reduce(
      (total, item) => total + Number(productCosts[item.id]) * (Number(item.quantity) || 0),
      0
    );
    month.net += orderRevenue - orderCost;
    month.orders += 1;
  });

  return { months, uncostedOrders };
}

export default function AdminDashboard({
  user,
  products,
  orders,
  inventory,
  productCosts,
  onRestock,
  onMarkDamaged,
  onUpdateProductCost
}) {
  const [stockView, setStockView] = useState("new");
  const { months, uncostedOrders } = useMemo(
    () => getMonthlyProfitLoss(orders, productCosts),
    [orders, productCosts]
  );
  const maxProfitLoss = Math.max(...months.map((month) => Math.abs(month.net)));
  const chartScale = maxProfitLoss || 1;
  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + (Number(order.total) || 0), 0);
  const totalSold = inventory.reduce((total, item) => total + item.sold, 0);
  const totalAvailable = inventory.reduce(
    (total, item) => total + item.received - item.sold - item.damaged,
    0
  );
  const totalDamaged = inventory.reduce((total, item) => total + item.damaged, 0);
  const totalReceived = inventory.reduce((total, item) => total + item.received, 0);
  const totalMovedOut = totalSold + totalDamaged;
  const chartPoints = months.map((month, index) => ({
    ...month,
    x: 42 + (index * 616) / (months.length - 1),
  }));
  const chartSegments = chartPoints.slice(1).map((point, index) => {
    const previous = chartPoints[index];
    const previousY = 112 - (previous.net / chartScale) * 78;
    const currentY = 112 - (point.net / chartScale) * 78;
    return {
      key: point.key,
      d: `M ${previous.x} ${previousY} L ${point.x} ${currentY}`,
      isLoss: (previous.net + point.net) / 2 < 0
    };
  });
  const initials = (user?.name || "Admin")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="admin-dashboard container page-enter">
      <div className="admin-dashboard-heading">
        <div>
          <span className="admin-eyebrow">HYNI FASHION STUDIO</span>
          <h1>Inventory & sales</h1>
          <p>Track product stock, barcode details, and recorded demo sales.</p>
        </div>
        <span className="admin-demo-badge">Local demo dashboard</span>
      </div>

      <section className="admin-stat-grid" aria-label="Store overview">
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><ShoppingBag size={20} /></span>
          <span className="admin-stat-label">Products</span>
          <strong>{products.length}</strong>
          <small>Styles in your catalogue</small>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><PackagePlus size={20} /></span>
          <span className="admin-stat-label">Available stock</span>
          <strong>{totalAvailable}</strong>
          <small>Units ready to sell</small>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><TrendingUp size={20} /></span>
          <span className="admin-stat-label">Units sold</span>
          <strong>{totalSold}</strong>
          <small>{orders.length} recorded demo orders</small>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><AlertTriangle size={20} /></span>
          <span className="admin-stat-label">Damaged</span>
          <strong>{totalDamaged}</strong>
          <small>Units removed from available stock</small>
        </article>
      </section>

      <div className="admin-dashboard-layout">
        <div className="admin-primary-column">
          <section className="admin-panel admin-sales-panel">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">MONTHLY PERFORMANCE</span>
                <h2>Profit &amp; loss</h2>
              </div>
              <div className="admin-chart-sales-total">
                <span>Total sales</span>
                <strong className="admin-revenue-total">{formatCurrency(totalRevenue)}</strong>
              </div>
            </div>
            <p className="admin-chart-caption">Monthly net from orders with product costs entered</p>
            <div className="admin-chart-legend">
              <span><i className="admin-legend-profit" /> Profit</span>
              <span><i className="admin-legend-loss" /> Loss</span>
            </div>
            <div className="admin-chart-wrap">
              <svg
                className="admin-sales-chart"
                viewBox="0 0 700 245"
                role="img"
                aria-label="Monthly profit and loss line graph for the latest twelve months"
              >
                {[34, 73, 112, 151, 190].map((y) => (
                  <line
                    key={y}
                    x1="42"
                    x2="672"
                    y1={y}
                    y2={y}
                    className={y === 112 ? "admin-chart-baseline" : "admin-chart-gridline"}
                  />
                ))}
                {[maxProfitLoss, maxProfitLoss / 2, 0, -maxProfitLoss / 2, -maxProfitLoss].map((value, index) => (
                  <text
                    key={index}
                    x="36"
                    y={38 + index * 39}
                    textAnchor="end"
                    className="admin-chart-value-label"
                  >
                    {formatChartValue(value)}
                  </text>
                ))}
                {chartSegments.map((segment) => (
                  <path
                    key={segment.key}
                    d={segment.d}
                    className={`admin-chart-line ${segment.isLoss ? "admin-chart-line-loss" : "admin-chart-line-profit"}`}
                  />
                ))}
                {chartPoints.map((point) => {
                  const y = 112 - (point.net / chartScale) * 78;
                  return (
                    <g key={point.key}>
                      <circle
                        cx={point.x}
                        cy={y}
                        r="4"
                        className={point.net < 0 ? "admin-chart-dot-loss" : "admin-chart-dot-profit"}
                      >
                        <title>{`${point.title}: ${formatCurrency(Math.abs(point.net))} ${point.net < 0 ? "loss" : "profit"} · ${point.orders} costed orders`}</title>
                      </circle>
                      <text
                        x={point.x}
                        y="222"
                        textAnchor="middle"
                        className="admin-chart-label"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="admin-sales-footnote">
              <span><ArrowUpRight size={15} /> Recorded sales</span>
              <strong>{formatCurrency(totalRevenue)}</strong>
              <span>{orders.length} orders · {uncostedOrders} need cost prices</span>
            </div>
          </section>

          <Link className="admin-panel admin-orders-link" to="/admin/orders">
            <span className="admin-orders-link-icon"><ClipboardList size={23} /></span>
            <span className="admin-orders-link-copy">
              <span className="admin-eyebrow">ORDER MANAGEMENT</span>
              <strong>Check orders</strong>
              <small>Open the order page to review customers, products, and quantities.</small>
            </span>
            <span className="admin-order-count">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
          </Link>
        </div>

        <aside className="admin-sidebar">
          <section className="admin-profile-card">
            <span className="admin-eyebrow">ADMIN PROFILE</span>
            <div className="admin-profile-avatar" aria-hidden="true">{initials}</div>
            <h2>{user?.name || "Store Admin"}</h2>
            <p className="admin-profile-role">Store administrator</p>
            <p className="admin-profile-email"><Mail size={15} /> {user?.email || "Admin email unavailable"}</p>
            <span className="admin-profile-status"><i /> Active session</span>
            <Link className="admin-workers-profile-link" to="/admin/workers">
              Workers, sales & growth
            </Link>
          </section>

          <section className="admin-stock-summary">
            <div className="admin-stock-summary-heading">
              <span className="admin-eyebrow">STOCK SNAPSHOT</span>
              <PackageCheck size={18} />
            </div>
            <article className="admin-stock-summary-card admin-stock-summary-new">
              <span><PackagePlus size={17} /> New / available stock</span>
              <strong>{totalAvailable.toLocaleString("en-IN")}</strong>
              <small>{totalReceived.toLocaleString("en-IN")} received units</small>
            </article>
            <article className="admin-stock-summary-card admin-stock-summary-old">
              <span><PackageX size={17} /> Old / moved stock</span>
              <strong>{totalMovedOut.toLocaleString("en-IN")}</strong>
              <small>{totalSold} sold · {totalDamaged} damaged</small>
            </article>
            <div className="admin-stock-summary-foot">
              <span><ArrowDownRight size={14} /> Low stock items</span>
              <strong>
                {products.filter((product) => {
                  const stock = inventory.find((item) => item.productId === product.id);
                  return stock && stock.received - stock.sold - stock.damaged <= 4;
                }).length}
              </strong>
            </div>
          </section>
        </aside>
      </div>

      <section className="admin-panel admin-stock-panel">
        <div className="admin-section-heading admin-stock-heading">
          <div>
            <span className="admin-eyebrow">PRODUCT DETAILS</span>
            <h2>Stock register</h2>
          </div>
          <div className="admin-stock-tabs" role="tablist" aria-label="Stock category">
            <button
              type="button"
              role="tab"
              aria-selected={stockView === "new"}
              className={stockView === "new" ? "active" : ""}
              onClick={() => setStockView("new")}
            >
              New stock
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={stockView === "old"}
              className={stockView === "old" ? "active" : ""}
              onClick={() => setStockView("old")}
            >
              Sold & damaged
            </button>
          </div>
        </div>
        <p className="admin-chart-caption">
          {stockView === "new"
            ? "Barcode, received quantity, and remaining stock for each style."
            : "Review sold and damaged units alongside the remaining stock."}
        </p>

        <div className="admin-table-scroll">
          <table className="admin-stock-table">
            <thead>
              <tr>
                <th>Barcode / code</th>
                <th>Product</th>
                <th>Unit cost</th>
                {stockView === "new" ? (
                  <>
                    <th>Received</th>
                    <th>Available</th>
                    <th>Stock action</th>
                  </>
                ) : (
                  <>
                    <th>Sold</th>
                    <th>Damaged</th>
                    <th>Available</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = inventory.find((item) => item.productId === product.id);
                if (!stock) return null;

                const available = Math.max(0, stock.received - stock.sold - stock.damaged);
                return (
                  <tr key={product.id}>
                    <td><Barcode code={product.code} /></td>
                    <td>
                      <div className="admin-stock-product">
                        <img src={product.image} alt="" loading="lazy" />
                        <span>
                          <strong>{product.name}</strong>
                          <span className="admin-product-category">{product.category}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <label className="admin-cost-input">
                        <span className="sr-only">Unit cost for {product.name}</span>
                        <span>₹</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={productCosts[product.id] ?? ""}
                          onChange={(event) =>
                            onUpdateProductCost(
                              product.id,
                              event.target.value === "" ? "" : Number(event.target.value)
                            )
                          }
                        />
                      </label>
                    </td>
                    {stockView === "new" ? (
                      <>
                        <td>{stock.received}</td>
                        <td><strong className="admin-available-count">{available}</strong></td>
                        <td>
                          <div className="admin-stock-actions">
                            <button type="button" onClick={() => onRestock(product.id)}>
                              + Add stock
                            </button>
                            <button
                              type="button"
                              disabled={available === 0}
                              onClick={() => onMarkDamaged(product.id)}
                            >
                              Mark damaged
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{stock.sold}</td>
                        <td>{stock.damaged}</td>
                        <td><strong className="admin-available-count">{available}</strong></td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="admin-notice">
        Inventory quantities are demo data saved in this browser. Orders and charts reflect demo checkouts;
        connect a protected backend before using this for real stock or sales records.
      </p>
    </main>
  );
}
