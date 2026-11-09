import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAccount } from "../utils/authApi";
import "../Styles/Login.css";

export default function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Customer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const account = await registerAccount({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role
      });
      onSignup?.(account);
      navigate(account.role === "Worker" ? "/worker" : "/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <span className="login-brand">HYNI</span>
        <div className="login-visual-content">
          <p className="login-eyebrow">YOUR STYLE, YOUR STORY</p>
          <h1>Make room for beautiful.</h1>
          <p>Join Hyni Fashion Studio and discover pieces made for your moments.</p>
        </div>
        <span className="login-visual-footer">Hyni Fashion Studio</span>
      </section>

      <section className="login-form-section">
        <div className="login-form-card">
          <span className="login-mobile-brand">HYNI</span>
          <p className="login-welcome">CREATE YOUR ACCOUNT</p>
          <h2>Join Hyni Fashion Studio</h2>
          <p className="login-subtitle">Create an account to save your details and shop our collection.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              autoComplete="name"
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              autoComplete="email"
              required
            />

            <label htmlFor="signup-role">Account type</label>
            <select
              id="signup-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Worker">Worker</option>
            </select>

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />

            <label htmlFor="signup-confirm-password">Confirm password</label>
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
              }}
              autoComplete="new-password"
              minLength={8}
              required
            />

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"} <span>→</span>
            </button>
          </form>

          <p className="login-terms">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p className="login-terms">
            Worker accounts open a tracked shift after sign-up. Your password is securely hashed before saving.
          </p>
        </div>
      </section>
    </main>
  );
}
