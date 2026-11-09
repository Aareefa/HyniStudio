import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search, ShoppingBag, Heart, UserRound, Menu, X
} from "lucide-react";
import "../Styles/Navbar.css";

export default function Navbar({
  user,
  cartCount,
  wishlistCount,
  onSearch
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e) {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <>
      <div className="sale-strip">
        <span>
          ✦ FESTIVE SALE — Discover your style · Special prices on selected
          collections · Wholesale orders from ₹25,000 ✦
        </span>
      </div>

      <header className="navbar">
        <Link to="/" className="brand">
          <img
            src="/hyni-logo.png"
            alt="Hyni Fashion Studio logo"
            className="brand-mark"
          />
          <span>Hyni <b>Fashion Studio</b></span>
        </Link>

        <form className="nav-search" onSubmit={submitSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, styles..."
            aria-label="Search products"
          />
          <button aria-label="Search">
            <Search size={19} />
          </button>
        </form>

        <div className="nav-actions">
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
          >
            <Heart />
            <small>{wishlistCount}</small>
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag />
            <small>{cartCount}</small>
          </Link>

          <div
            className="more-menu-wrap"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setMoreOpen(false);
              }
            }}
          >
            <button
              className="more-menu-btn"
              onClick={() => setMoreOpen(!moreOpen)}
              aria-label={moreOpen ? "Close more menu" : "Open more menu"}
              aria-expanded={moreOpen}
              aria-controls="more-menu"
            >
              {moreOpen ? <X /> : <Menu />}
            </button>
            {moreOpen && (
              <div className="more-menu" id="more-menu">
                <NavLink to="/" onClick={() => setMoreOpen(false)}>Home</NavLink>
                <a href="/#categories" onClick={() => setMoreOpen(false)}>Categories</a>
                {(user?.role === "Admin" || user?.role === "Customer" || user?.role === "Wholesaler") && (
                  <NavLink
                    to={user.role === "Admin" ? "/admin/orders" : "/orders"}
                    onClick={() => setMoreOpen(false)}
                  >
                    Orders
                  </NavLink>
                )}
                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setMoreOpen(false)}
                >
                  <UserRound size={17} />
                  Account
                </Link>
              </div>
            )}
          </div>
        </div>

      </header>
    </>
  );
}
