import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            Hyni Fashion Studio
          </Link>

          <p>
            Discover elegant styles, timeless designs and fashion for every
            occasion.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div>
          <h3>Your Account</h3>
          <Link to="/login">Sign In / Register</Link>
          <Link to="/cart">Shopping Bag</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Hyni Fashion Studio. All rights reserved.
      </div>
    </footer>
  );
}