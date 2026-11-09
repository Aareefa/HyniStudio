import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({
  user,
  cartCount = 0,
  wishlistCount = 0,
  onSearch
}) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitSearch(event) {
    event.preventDefault();
    onSearch(search);
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="navbar container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">H</span>
          <span>Hyni Fashion Studio</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={closeMenu}>
            Products
          </NavLink>

          <NavLink to="/wishlist" onClick={closeMenu}>
            Wishlist ({wishlistCount})
          </NavLink>

          <NavLink to="/cart" onClick={closeMenu}>
            Bag ({cartCount})
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>
                My Account
              </NavLink>

              {user.role === "Admin" && (
                <NavLink to="/admin" onClick={closeMenu}>
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>
              Sign In
            </NavLink>
          )}
        </nav>

        <form className="navbar-search" onSubmit={submitSearch}>
          <input
            type="search"
            placeholder="Search styles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />

          <button type="submit" aria-label="Search">
            ⌕
          </button>
        </form>
      </div>
    </header>
  );
}