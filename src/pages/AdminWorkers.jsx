import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  Shirt,
  ShoppingBag,
  TrendingUp,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminRequest } from "../utils/authApi";
import "../Styles/AdminWorkers.css";

const DAY_COUNT = 7;

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getRecentDays(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  });
}

function formatDay(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
}

function formatTimestamp(value) {
  return value
    ? new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    })
    : "Not recorded";
}

function getProfit(sale) {
  return Number.isFinite(Number(sale.profit))
    ? Number(sale.profit)
    : Number.isFinite(Number(sale.cost))
      ? Number(sale.amount) - Number(sale.cost)
      : null;
}

function DailyGrowthChart({ days, sales }) {
  const dayStats = days.map((date) => {
    const daySales = sales.filter((sale) => sale.date === date);
    return {
      date,
      revenue: daySales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0),
      profit: daySales.reduce((sum, sale) => sum + (getProfit(sale) ?? 0), 0)
    };
  });
  const maximum = Math.max(1, ...dayStats.flatMap((day) => [day.revenue, day.profit]));
  const minimum = Math.min(0, ...dayStats.map((day) => day.profit));
  const range = Math.max(1, maximum - minimum);
  const points = dayStats.map((day, index) => ({
    x: 54 + index * 102,
    revenueY: 188 - ((day.revenue - minimum) / range) * 145,
    profitY: 188 - ((day.profit - minimum) / range) * 145,
    ...day
  }));
  const revenuePath = points.map((point) => `${point.x},${point.revenueY}`).join(" ");
  const profitPath = points.map((point) => `${point.x},${point.profitY}`).join(" ");

  return (
    <div className="admin-workers-chart-wrap">
      <div className="admin-workers-chart-meta">
        <span>Last 7 days</span>
        <div className="admin-workers-chart-legend">
          <span><i className="admin-workers-legend-revenue" /> Revenue</span>
          <span><i className="admin-workers-legend-profit" /> Profit</span>
        </div>
      </div>
      <svg
        className="admin-workers-chart"
        viewBox="0 0 690 235"
        role="img"
        aria-label="Daily worker sales revenue and profit over the last seven days"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = 43 + line * 48;
          return <line key={line} x1="35" x2="670" y1={y} y2={y} className="admin-workers-gridline" />;
        })}
        <polyline points={revenuePath} className="admin-workers-line-revenue" />
        <polyline points={profitPath} className="admin-workers-line-profit" />
        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.revenueY} r="4" className="admin-workers-dot-revenue">
              <title>{`${point.date}: Revenue ${formatCurrency(point.revenue)}`}</title>
            </circle>
            <circle cx={point.x} cy={point.profitY} r="4" className="admin-workers-dot-profit">
              <title>{`${point.date}: Profit ${formatCurrency(point.profit)}`}</title>
            </circle>
            <text x={point.x} y="222" textAnchor="middle" className="admin-workers-chart-label">
              {formatDay(point.date)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AdminWorkers({ user }) {
  const [workers, setWorkers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminRequest("/api/admin/workers", user.sessionToken)
      .then((result) => {
        if (active) {
          setWorkers(result.workers);
          setSelectedEmail((current) =>
            current === "all" && result.workers.length
              ? result.workers[0].email
              : current
          );
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user.sessionToken]);

  const selectedWorker = workers.find((worker) => worker.email === selectedEmail);
  const visibleWorkers = selectedWorker ? [selectedWorker] : workers;
  const visibleSales = visibleWorkers.flatMap((worker) => worker.sales);
  const days = useMemo(() => getRecentDays(DAY_COUNT), []);
  const recentSales = visibleSales.filter((sale) => days.includes(sale.date));
  const revenue = recentSales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
  const profitRecords = recentSales.filter((sale) => getProfit(sale) !== null);
  const profit = profitRecords.reduce((sum, sale) => sum + getProfit(sale), 0);
  const unknownCostCount = recentSales.length - profitRecords.length;
  const allRevenue = (selectedWorker?.sales || []).reduce(
    (sum, sale) => sum + Number(sale.amount || 0),
    0
  );
  const allProfitSales = (selectedWorker?.sales || []).filter(
    (sale) => getProfit(sale) !== null
  );
  const allProfit = allProfitSales.reduce((sum, sale) => sum + getProfit(sale), 0);
  const latestShift = selectedWorker?.attendance.at(-1);
  const latestDressCode = selectedWorker?.dressCode.at(-1);
  const completedDressCodeCount = latestDressCode
    ? Object.values(latestDressCode.checklist).filter(Boolean).length
    : 0;
  const latestDressCodeTotal = latestDressCode
    ? Object.keys(latestDressCode.checklist).length
    : 0;

  const selectedActivity = selectedWorker
    ? [...new Set([
      ...selectedWorker.attendance.map((entry) => entry.date),
      ...selectedWorker.sales.map((entry) => entry.date),
      ...selectedWorker.dressCode.map((entry) => entry.date)
    ])]
      .map((date) => ({
        date,
        shift: [...selectedWorker.attendance].reverse().find((entry) => entry.date === date),
        sales: selectedWorker.sales.filter((entry) => entry.date === date),
        dressCode: selectedWorker.dressCode.find((entry) => entry.date === date)
      }))
      .sort((left, right) => right.date.localeCompare(left.date))
    : [];

  return (
    <main className="admin-workers-page container page-enter">
      <Link to="/admin" className="admin-workers-back"><ArrowLeft size={17} /> Back to admin dashboard</Link>
      <header className="admin-workers-heading">
        <div>
          <span className="admin-eyebrow">STAFF PERFORMANCE</span>
          <h1>Workers overview</h1>
          <p>Review staff attendance, daily performance, and sales growth.</p>
        </div>
      </header>

      {error && <p className="admin-workers-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="admin-workers-loading">Loading worker records...</p>
      ) : (
        <>
          <div className="admin-workers-layout">
            <aside className="admin-workers-directory admin-workers-panel">
              <div className="admin-workers-panel-heading">
                <div>
                  <span className="admin-eyebrow">TEAM</span>
                  <h2>Workers</h2>
                </div>
                <span className="admin-workers-count">{workers.length}</span>
              </div>
              <button
                type="button"
                className={`admin-workers-list-item admin-workers-all${selectedEmail === "all" ? " is-active" : ""}`}
                onClick={() => setSelectedEmail("all")}
              >
                <span className="admin-workers-avatar"><Users size={17} /></span>
                <span className="admin-workers-list-copy">
                  <strong>All workers</strong>
                  <small>Company overview</small>
                </span>
              </button>
              <div className="admin-workers-list">
                {workers.map((worker) => (
                  <button
                    type="button"
                    key={worker.email}
                    className={`admin-workers-list-item${worker.email === selectedEmail ? " is-active" : ""}`}
                    onClick={() => setSelectedEmail(worker.email)}
                  >
                    <span className="admin-workers-avatar">
                      {worker.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                    </span>
                    <span className="admin-workers-list-copy">
                      <strong>{worker.name}</strong>
                      <small>{worker.email}</small>
                    </span>
                    <span className="admin-workers-online-dot" aria-label="Worker account" />
                  </button>
                ))}
                {!workers.length && <p className="admin-workers-empty">No worker accounts yet.</p>}
              </div>
            </aside>

            <section className="admin-workers-center">
              <section className="admin-workers-panel admin-workers-chart-panel">
                <div className="admin-workers-panel-heading">
                  <div>
                    <span className="admin-eyebrow">PERFORMANCE OVERVIEW</span>
                    <h2>{selectedWorker ? selectedWorker.name : "Company growth"}</h2>
                  </div>
                  <span className="admin-workers-period"><CalendarDays size={14} /> Last 7 days</span>
                </div>
                <DailyGrowthChart days={days} sales={visibleSales} />
              </section>

              <section className="admin-workers-stats">
                <article>
                  <span><ShoppingBag size={16} /> Sales · 7 days</span>
                  <strong>{recentSales.length}</strong>
                  <small>{selectedWorker ? "Your selected worker" : "Across the team"}</small>
                </article>
                <article>
                  <span><TrendingUp size={16} /> Revenue</span>
                  <strong>{formatCurrency(revenue)}</strong>
                  <small>Last 7 days</small>
                </article>
                <article>
                  <span><TrendingUp size={16} /> Recorded profit</span>
                  <strong>{formatCurrency(profit)}</strong>
                  <small>{unknownCostCount ? `${unknownCostCount} sale(s) missing cost` : "Last 7 days"}</small>
                </article>
              </section>
            </section>

            <aside className="admin-workers-profile admin-workers-panel">
              {selectedWorker ? (
                <>
                  <div className="admin-workers-profile-top">
                    <span className="admin-workers-profile-avatar">
                      {selectedWorker.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                    </span>
                    <h2>{selectedWorker.name}</h2>
                    <span className="admin-workers-role">Store worker</span>
                  </div>
                  <div className="admin-workers-profile-details">
                    <div><Mail size={15} /><span><small>Email address</small><strong>{selectedWorker.email}</strong></span></div>
                    <div><Clock3 size={15} /><span><small>Last sign in</small><strong>{formatTimestamp(latestShift?.loginAt)}</strong></span></div>
                    <div><Clock3 size={15} /><span><small>Last sign out</small><strong>{formatTimestamp(latestShift?.logoutAt)}</strong></span></div>
                  </div>
                  <div className="admin-workers-profile-summary">
                    <div><span>Total sales</span><strong>{selectedWorker.sales.length}</strong></div>
                    <div><span>Revenue</span><strong>{formatCurrency(allRevenue)}</strong></div>
                    <div><span>Profit</span><strong>{allProfitSales.length ? formatCurrency(allProfit) : "No cost data"}</strong></div>
                  </div>
                  <div className="admin-workers-dress-code">
                    <div className="admin-workers-dress-heading"><Shirt size={16} /><strong>Latest dress code</strong></div>
                    {latestDressCode ? (
                      <>
                        <small>{latestDressCode.date}</small>
                        <strong>{completedDressCodeCount}/{latestDressCodeTotal} checks complete</strong>
                      </>
                    ) : (
                      <small>No checklist submitted yet</small>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-workers-profile-top">
                    <span className="admin-workers-profile-avatar"><Users size={24} /></span>
                    <h2>Team overview</h2>
                    <span className="admin-workers-role">{workers.length} workers</span>
                  </div>
                  <div className="admin-workers-profile-summary admin-workers-team-summary">
                    <div><span>Total sales</span><strong>{visibleSales.length}</strong></div>
                    <div><span>Revenue · 7 days</span><strong>{formatCurrency(revenue)}</strong></div>
                    <div><span>Profit · 7 days</span><strong>{formatCurrency(profit)}</strong></div>
                  </div>
                  <p className="admin-workers-profile-hint">Choose a worker from the team list to view their personal attendance and daily checklist.</p>
                </>
              )}
            </aside>
          </div>

          <section className="admin-workers-panel admin-workers-history">
            <div className="admin-workers-panel-heading">
              <div>
                <span className="admin-eyebrow">DAILY RECORDS</span>
                <h2>{selectedWorker ? `${selectedWorker.name} · daily status` : "Team daily status"}</h2>
              </div>
            </div>
            <div className="admin-workers-table-wrap">
              <table className="admin-workers-table">
                <thead>
                  <tr><th>Date</th><th>Worker</th><th>Login</th><th>Logout</th><th>Sales</th><th>Revenue</th><th>Profit</th><th>Dress code</th></tr>
                </thead>
                <tbody>
                  {visibleWorkers.flatMap((worker) => {
                    const dates = selectedWorker
                      ? selectedActivity
                      : [...new Set([
                        ...worker.attendance.map((entry) => entry.date),
                        ...worker.sales.map((entry) => entry.date),
                        ...worker.dressCode.map((entry) => entry.date)
                      ])].map((date) => ({
                        date,
                        shift: [...worker.attendance].reverse().find((entry) => entry.date === date),
                        sales: worker.sales.filter((entry) => entry.date === date),
                        dressCode: worker.dressCode.find((entry) => entry.date === date)
                      })).sort((left, right) => right.date.localeCompare(left.date));
                    return dates.map(({ date, shift, sales: daySales, dressCode }) => {
                      const knownSales = daySales.filter((sale) => getProfit(sale) !== null);
                      const checklist = dressCode?.checklist;
                      const completed = checklist ? Object.values(checklist).filter(Boolean).length : 0;
                      const checklistTotal = checklist ? Object.keys(checklist).length : 0;
                      return (
                        <tr key={`${worker.email}-${date}`}>
                          <td>{date}</td>
                          <td>{worker.name}</td>
                          <td>{formatTimestamp(shift?.loginAt)}</td>
                          <td>{formatTimestamp(shift?.logoutAt)}</td>
                          <td>{daySales.length}</td>
                          <td>{formatCurrency(daySales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0))}</td>
                          <td>{knownSales.length ? formatCurrency(knownSales.reduce((sum, sale) => sum + getProfit(sale), 0)) : daySales.length ? "No cost data" : formatCurrency(0)}</td>
                          <td>{checklist ? `${completed}/${checklistTotal} complete` : "Not submitted"}</td>
                        </tr>
                      );
                    });
                  })}
                  {!visibleWorkers.some((worker) => worker.attendance.length || worker.sales.length || worker.dressCode.length) && (
                    <tr><td colSpan="8">No attendance or sales have been recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
