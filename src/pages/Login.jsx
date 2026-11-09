import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DEMO_USERS from "../data/demoUsers";
import { loginAccount } from "../utils/authApi";
import "../Styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const account = await loginAccount(email, password);
      onLogin?.(account);
      navigate(account.role === "Admin" ? "/admin" : account.role === "Worker" ? "/worker" : "/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectAccount(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <span className="login-brand">HYNI</span>
        <div className="login-visual-content">
          <p className="login-eyebrow">YOUR STYLE, YOUR STORY</p>
          <h1>Elegance begins with you.</h1>
          <p>
            Discover timeless fashion and pieces that make every moment
            feel special.
          </p>
        </div>
        <span className="login-visual-footer">Hyni Fashion Studio</span>
      </section>

      <section className="login-form-section">
        <div className="login-form-card">
          <span className="login-mobile-brand">HYNI</span>
          <p className="login-welcome">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="login-subtitle">
            Enter your details to continue shopping.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              required
            />

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"} <span>→</span>
            </button>
          </form>

          <div className="demo-accounts">
            <p className="demo-accounts-title">Try a demo account</p>
            <p className="demo-accounts-password">Shared password: <strong>hyni123</strong></p>
            <div className="demo-account-list">
              {DEMO_USERS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="demo-account"
                  onClick={() => selectAccount(account)}
                >
                  <span>{account.name}</span>
                  <span>{account.role}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="login-terms">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="login-terms">
            New to Hyni? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}