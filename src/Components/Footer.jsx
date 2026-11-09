import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import "../Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid container">

        {/* About Section */}
        <div className="footer-about">
          <Link to="/" className="footer-brand">
            Hyni Fashion Studio
          </Link>

          <p>
            Discover fashion that celebrates your personal style.
            From everyday outfits to special occasion wear, find
            pieces you'll love wearing.
          </p>

          <a
            className="social-link"
            href="https://www.instagram.com/hynifashionstudio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
              />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="0.8"
                fill="currentColor"
              />
            </svg>

            <span>Follow us on Instagram</span>
          </a>
        </div>

        {/* Shop Section */}
        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/products">All products</Link>
          <Link to="/category/sarees">Sarees</Link>
          <Link to="/category/frocks">Frocks</Link>
          <Link to="/category/kurtas">Kurtas</Link>
          <Link to="/category/anarkali">Anarkali</Link>
        </div>

        {/* Customer Care Section */}
        <div className="footer-column">
          <h3>Customer care</h3>

          <Link to="/login">My account</Link>
          <Link to="/cart">Shopping bag</Link>
          <Link to="/wishlist">Wishlist</Link>

          <a href="mailto:hello@example.com">
            <Mail size={15} />
            <span>Email us</span>
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Hyni Fashion Studio.
        All rights reserved.
      </div>
    </footer>
  );
}
