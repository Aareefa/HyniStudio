import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  categories,
  categoryImages,
  toCategorySlug
} from "../data/products";
import "../Styles/Products.css";

export default function Products({
  products = [],
  user,
  wishlist = [],
  onWishlist,
  onAdd,
  searchTerm = "",
  categoryOnly = ""
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(
    categoryOnly || searchParams.get("category") || "All"
  );

  const [sort, setSort] = useState("featured");

  const [query, setQuery] = useState(searchTerm);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const text =
        `${product.name} ${product.category} ${product.id}`.toLowerCase();

      const matchesSearch = text.includes(query.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, query, sort]);

  return (
    <main className="container page-enter products-page">
      <div className="page-heading">
        <span className="eyebrow">OUR COLLECTION</span>
        <h1>{categoryOnly || "Shop All Styles"}</h1>
        <p>
          {categoryOnly
            ? `Explore our ${categoryOnly.toLowerCase()} collection.`
            : "Browse traditional favourites and new-season outfits."}
        </p>
        {categoryOnly && (
          <Link className="outline-btn" to="/products">
            Browse all categories
          </Link>
        )}
      </div>

      <div className="catalog-toolbar">
        <input
          className="catalog-search"
          type="search"
          placeholder="Search by name, category or code..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          className="catalog-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {!categoryOnly && (
        <div className="category-filters">
          {categories.map((item) => (
            <Link
              key={item}
              className={`filter-btn ${category === item ? "active" : ""}`}
              to={item === "All" ? "/products" : `/category/${toCategorySlug(item)}`}
            >
              <img
                src={categoryImages[item]}
                alt=""
                aria-hidden="true"
              />
              {item}
            </Link>
          ))}
        </div>
      )}

      <p className="result-count">
        Showing {filteredProducts.length} product(s)
        {user ? ` · Welcome, ${user.name}` : ""}
      </p>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
          <button
            className="primary-btn"
            onClick={() => {
              setCategory("All");
              setQuery("");
              setSearchParams({});
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="product-image"
              >
                <img src={product.image} alt={product.name} loading="lazy" />
              </Link>

              <button
                className={`wishlist-btn ${
                  wishlist.includes(product.id) ? "active" : ""
                }`}
                onClick={() => onWishlist(product.id)}
                aria-label="Toggle wishlist"
              >
                {wishlist.includes(product.id) ? "♥" : "♡"}
              </button>

              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link to={`/products/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <p className="product-rating">★ {product.rating}</p>
                <p className="product-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <button
                  className="primary-btn full-btn"
                  onClick={() =>
                    onAdd(product, product.sizes[0], product.colors[0])
                  }
                >
                  Add to Bag
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}