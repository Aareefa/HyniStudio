import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, LogOut, PlusCircle, Shirt, ShoppingBag } from "lucide-react";
import { workerRequest } from "../utils/authApi";
import "../Styles/WorkerDashboard.css";

const checklistLabels = [
  ["uniform", "Store uniform"],
  ["nameBadge", "Name badge"],
  ["footwear", "Approved footwear"],
  ["grooming", "Neat grooming"]
];

const emptyChecklist = Object.fromEntries(
  checklistLabels.map(([key]) => [key, false])
);

function formatTime(value) {
  if (!value) return "In progress";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function WorkerDashboard({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [checklist, setChecklist] = useState(emptyChecklist);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboard = useCallback(async () => {
    const result = await workerRequest(
      "/api/worker/dashboard",
      user.sessionToken
    );
    setDashboard(result);
    setChecklist(result.dressCode?.checklist || emptyChecklist);
  }, [user.sessionToken]);

  useEffect(() => {
    let active = true;
    workerRequest("/api/worker/dashboard", user.sessionToken)
      .then((result) => {
        if (!active) return;
        setDashboard(result);
        setChecklist(result.dressCode?.checklist || emptyChecklist);
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

  const todaySales = useMemo(
    () => (dashboard?.sales || []).filter((sale) => sale.date === dashboard?.day),
    [dashboard]
  );
  const totalToday = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const itemsToday = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);
  const activeShift = [...(dashboard?.attendance || [])]
    .reverse()
    .find((shift) => shift.id && !shift.logoutAt);

  async function saveSale(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      await workerRequest("/api/worker/sales", user.sessionToken, {
        method: "POST",
        body: {
          description,
          amount: Number(amount),
          cost: Number(cost),
          quantity: Number(quantity)
        }
      });
      setDescription("");
      setAmount("");
      setCost("");
      setQuantity("1");
      await loadDashboard();
      setNotice("Sale recorded for today.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveChecklist(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      await workerRequest("/api/worker/dress-code", user.sessionToken, {
        method: "POST",
        body: { checklist }
      });
      await loadDashboard();
      setNotice("Today's dress-code checklist has been saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="worker-dashboard container page-enter">
      <header className="worker-heading">
        <div>
          <span className="worker-eyebrow">STAFF WORKSPACE · {dashboard?.day || "TODAY"}</span>
          <h1>Welcome, {user.name}</h1>
          <p>Track your shift, daily checklist, and in-store sales.</p>
        </div>
        <button className="worker-logout" type="button" onClick={onLogout}>
          <LogOut size={17} /> End shift & sign out
        </button>
      </header>

      {error && <p className="worker-message worker-error" role="alert">{error}</p>}
      {notice && <p className="worker-message worker-success" role="status">{notice}</p>}
      {isLoading ? (
        <p className="worker-loading">Loading your shift records...</p>
      ) : (
        <>
          <section className="worker-stats" aria-label="Today's work summary">
            <article className="worker-stat">
              <span className="worker-stat-icon"><ShoppingBag size={20} /></span>
              <span>Sales today</span>
              <strong>{todaySales.length}</strong>
              <small>Recorded sales</small>
            </article>
            <article className="worker-stat">
              <span className="worker-stat-icon"><CheckCircle2 size={20} /></span>
              <span>Sales total today</span>
              <strong>{formatCurrency(totalToday)}</strong>
              <small>{itemsToday} items sold</small>
            </article>
            <article className="worker-stat">
              <span className="worker-stat-icon"><Clock3 size={20} /></span>
              <span>Shift started</span>
              <strong className="worker-stat-time">
                {activeShift ? formatTime(activeShift.loginAt) : "No active shift"}
              </strong>
              <small>{activeShift ? "Sign out to record your end time" : "Sign in to start a shift"}</small>
            </article>
          </section>

          <div className="worker-panels">
            <section className="worker-panel">
              <div className="worker-panel-heading">
                <span className="worker-stat-icon"><ShoppingBag size={20} /></span>
                <div>
                  <h2>Record an in-store sale</h2>
                  <p>Each entry is dated and linked to your current shift.</p>
                </div>
              </div>
              <form className="worker-form" onSubmit={saveSale}>
                <label>
                  Sale description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={120}
                    placeholder="Item or receipt reference"
                    required
                  />
                </label>
                <div className="worker-form-row">
                  <label>
                    Sale amount (₹)
                    <input
                      type="number"
                      min="0.01"
                      max="10000000"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Total cost (₹)
                    <input
                      type="number"
                      min="0"
                      max="10000000"
                      step="0.01"
                      value={cost}
                      onChange={(event) => setCost(event.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="worker-form-row">
                  <label>
                    Items sold
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      step="1"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      required
                    />
                  </label>
                </div>
                <button className="worker-primary-btn" type="submit" disabled={isSaving}>
                  <PlusCircle size={17} /> {isSaving ? "Saving..." : "Add sale"}
                </button>
              </form>
            </section>

            <section className="worker-panel">
              <div className="worker-panel-heading">
                <span className="worker-stat-icon"><Shirt size={20} /></span>
                <div>
                  <h2>Daily dress-code checklist</h2>
                  <p>Complete and save the checklist for today.</p>
                </div>
              </div>
              <form className="worker-checklist" onSubmit={saveChecklist}>
                {checklistLabels.map(([key, label]) => (
                  <label className="worker-check-item" key={key}>
                    <input
                      type="checkbox"
                      checked={Boolean(checklist[key])}
                      onChange={(event) =>
                        setChecklist((current) => ({
                          ...current,
                          [key]: event.target.checked
                        }))
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
                <button className="worker-primary-btn" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save today's checklist"}
                </button>
              </form>
            </section>
          </div>

          <section className="worker-panel worker-history-panel">
            <div className="worker-panel-heading">
              <span className="worker-stat-icon"><Clock3 size={20} /></span>
              <div>
                <h2>Shift history</h2>
                <p>Sign-in and sign-out times are recorded automatically.</p>
              </div>
            </div>
            <div className="worker-table-wrap">
              <table className="worker-table">
                <thead>
                  <tr><th>Date</th><th>Sign in</th><th>Sign out</th></tr>
                </thead>
                <tbody>
                  {(dashboard?.attendance || []).slice().reverse().map((shift) => (
                    <tr key={shift.id}>
                      <td>{shift.date}</td>
                      <td>{formatTime(shift.loginAt)}</td>
                      <td>{formatTime(shift.logoutAt)}</td>
                    </tr>
                  ))}
                  {!dashboard?.attendance?.length && (
                    <tr><td colSpan="3">No shift history yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="worker-panel worker-history-panel">
            <div className="worker-panel-heading">
              <span className="worker-stat-icon"><ShoppingBag size={20} /></span>
              <div>
                <h2>Sales history</h2>
                <p>Your recorded sales, newest first.</p>
              </div>
            </div>
            <div className="worker-table-wrap">
              <table className="worker-table">
                <thead>
                  <tr><th>Date</th><th>Description</th><th>Items</th><th>Revenue</th><th>Profit</th></tr>
                </thead>
                <tbody>
                  {(dashboard?.sales || []).slice().reverse().map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.date}</td>
                      <td>{sale.description}</td>
                      <td>{sale.quantity}</td>
                      <td>{formatCurrency(sale.amount)}</td>
                      <td>{formatCurrency(sale.profit)}</td>
                    </tr>
                  ))}
                  {!dashboard?.sales?.length && (
                    <tr><td colSpan="5">No sales recorded yet.</td></tr>
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
