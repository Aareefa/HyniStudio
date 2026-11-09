
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
// import "../Styles/Products.css";
import "../Styles/Products.css";

const demoProducts = [
  { id: 1, name: "Floral Silk Saree", category: "Sarees", price: 2499, oldPrice: 3299, rating: 4.8, image: "photo-1610030469983-98e550d6193c", tag: "Bestseller" },
  { id: 2, name: "Elegant Party Gown", category: "Gowns", price: 2899, oldPrice: 3599, rating: 4.7, image: "photo-1566174053879-31528523f8ae", tag: "Trending" },
  { id: 3, name: "Classic Designer Kurti", category: "Kurtis", price: 1199, oldPrice: 1599, rating: 4.6, image: "photo-1583391733958-6c78276477e8", tag: "New" },
  { id: 4, name: "Rose Evening Dress", category: "Dresses", price: 1999, oldPrice: 2599, rating: 4.8, image: "photo-1539109136881-3be0616acf4b", tag: "Popular" },
  { id: 5, name: "Pastel Festive Saree", category: "Sarees", price: 2199, oldPrice: 2899, rating: 4.5, image: "photo-1585487000160-6ebcfceb0d03" },
  { id: 6, name: "Modern Straight Kurti", category: "Kurtis", price: 999, oldPrice: 1399, rating: 4.6, image: "photo-1610030469668-8e9f641a5e87" },
  { id: 7, name: "Premium Party Dress", category: "Dresses", price: 1799, oldPrice: 2299, rating: 4.7, image: "photo-1595777457583-95e059d581b8" },
  { id: 8, name: "Embroidered Anarkali", category: "Ethnic Wear", price: 2399, oldPrice: 2999, rating: 4.8, image: "photo-1597983073493-88cd35cf93b0" },
  { id: 9, name: "Chic Everyday Top", category: "Tops", price: 799, oldPrice: 1099, rating: 4.4, image: "photo-1551163943-3f6a855d1153" },
  { id: 10, name: "Luxury Wedding Gown", category: "Gowns", price: 4299, oldPrice: 5299, rating: 4.9, image: "photo-1594552072238-b8a33785b261", tag: "Premium" },
  { id: 11, name: "Printed Cotton Kurti", category: "Kurtis", price: 899, oldPrice: 1199, rating: 4.5, image: "photo-1583391733981-8498405f9c7b" },
  { id: 12, name: "Elegant Midi Dress", category: "Dresses", price: 1599, oldPrice: 1999, rating: 4.6, image: "photo-1515886657613-9f3515b0c78f" },
  { id: 13, name: "Designer Silk Saree", category: "Sarees", price: 3199, oldPrice: 3999, rating: 4.9, image: "photo-1617627143750-d86bc21e42bb", tag: "Premium" },
  { id: 14, name: "Casual Chic Top", category: "Tops", price: 699, oldPrice: 999, rating: 4.3, image: "photo-1483985988355-763728e1935b" },
  { id: 15, name: "Festive Ethnic Set", category: "Ethnic Wear", price: 1899, oldPrice: 2499, rating: 4.7, image: "photo-1594633312681-425c7b97ccd1" },
  { id: 16, name: "Minimal Co-ord Set", category: "Co-ord Sets", price: 1499, oldPrice: 1999, rating: 4.5, image: "photo-1485230895905-ec40ba36b9bc" },
  { id: 17, name: "Graceful Maxi Dress", category: "Dresses", price: 1899, oldPrice: 2399, rating: 4.7, image: "photo-1490481651871-ab68de25d43d" },
  { id: 18, name: "Contemporary Kurti Set", category: "Kurtis", price: 1699, oldPrice: 2199, rating: 4.6, image: "photo-1618932260643-eee4a2f652a6" },
  { id: 19, name: "Statement Party Gown", category: "Gowns", price: 3499, oldPrice: 4299, rating: 4.8, image: "photo-1568252542512-9fe8fe9c87bb" },
  { id: 20, name: "Summer Floral Top", category: "Tops", price: 749, oldPrice: 999, rating: 4.4, image: "photo-1529139574466-a303027c1d8b" },
];

const categories = [
  "All Products",
  "Sarees",
  "Kurtis",
  "Dresses",
  "Gowns",
  "Tops",
  "Ethnic Wear",
  "Co-ord Sets",
];

const imageUrl = (image) =>
  image?.startsWith("http")
    ? image
    : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=85`;

export default function Products({
  products = [],
  wishlist = [],
  onWishlist,
  onAdd,
}) {
  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [localWishlist, setLocalWishlist] = useState([]);

  const productList = products.length ? products : demoProducts;

  const filteredProducts = useMemo(() => {
    let result = productList.filter((product) => {
      const matchesCategory =
        category === "All Products" || product.category === category;

      const matchesSearch =
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.category || "").toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [productList, category, search, sort]);

  function toggleWishlist(product) {
    if (onWishlist) {
      onWishlist(product);
      return;
    }

    setLocalWishlist((current) =>
      current.includes(product.id)
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    );
  }

  function isWishlisted(product) {
    return localWishlist.includes(product.id) ||
      wishlist.some((item) => item.id === product.id || item === product.id);
  }

  return (
    <main className="shop-page">
      <section className="shop-banner">
        <div className="shop-banner-content">
          <span className="shop-eyebrow">THE HYNI COLLECTION</span>
          <h1>Shop All <span>Styles</span></h1>
          <p>Find your next favourite outfit, made for every moment.</p>
          <div className="shop-banner-note">EVERYDAY ELEGANCE · TIMELESS STYLE</div>
        </div>
      </section>

      <div className="shop-layout">
        <aside className={`shop-sidebar ${mobileFilters ? "filters-open" : ""}`}>
          <div className="sidebar-heading">
            <div>
              <span className="sidebar-kicker">DISCOVER</span>
              <h2>Categories</h2>
            </div>
            <button
              className="close-filters"
              onClick={() => setMobileFilters(false)}
              aria-label="Close categories"
            >
              <X size={20} />
            </button>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-option ${category === item ? "selected" : ""}`}
                onClick={() => {
                  setCategory(item);
                  setMobileFilters(false);
                }}
              >
                <span>{item}</span>
                <span className="category-arrow">›</span>
              </button>
            ))}
          </div>

          <div className="sidebar-promo">
            <span className="promo-star">✦</span>
            <p>Style is a way to say who you are.</p>
            <span>Find your Hyni look.</span>
          </div>
        </aside>

        {mobileFilters && (
          <button
            className="filters-backdrop"
            onClick={() => setMobileFilters(false)}
            aria-label="Close filters"
          />
        )}

        <section className="shop-main">
          <div className="shop-heading-row">
            <div>
              <span className="section-kicker">CURATED FOR YOU</span>
              <h2>{category}</h2>
              <p>{filteredProducts.length} styles to explore</p>
            </div>

            <div className="shop-controls">
              <button
                className="mobile-filter-button"
                onClick={() => setMobileFilters(true)}
              >
                <SlidersHorizontal size={17} />
                Categories
              </button>

              <label className="shop-search">
                <Search size={17} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search styles..."
                  aria-label="Search styles"
                />
              </label>

              <select
                className="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article className="shop-product-card" key={product.id}>
                <div className="product-image-wrap">
                  <Link
                    to={`/products/${product.id}`}
                    className="product-image-link"
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={imageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                    />
                  </Link>

                  {product.tag && (
                    <span className="product-tag">{product.tag}</span>
                  )}

                  <button
                    className={`product-wishlist ${isWishlisted(product) ? "wishlisted" : ""}`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted(product) ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    className="quick-add"
                    onClick={() => onAdd?.(product)}
                  >
                    <ShoppingBag size={16} />
                    Add to Bag
                  </button>
                </div>

                <div className="shop-product-info">
                  <span className="product-category">{product.category}</span>
                  <Link
                    to={`/products/${product.id}`}
                    className="shop-product-name"
                  >
                    {product.name}
                  </Link>

                  <div className="product-rating">
                    <Star size={13} fill="currentColor" />
                    <span>{product.rating ?? "4.5"}</span>
                    <span className="rating-label">Customer favourite</span>
                  </div>

                  <div className="product-price-row">
                    <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                    {product.oldPrice && (
                      <del>₹{Number(product.oldPrice).toLocaleString("en-IN")}</del>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="shop-empty">
              <Search size={34} />
              <h3>No styles found</h3>
              <p>Try another search or choose a different category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Products");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="shop-bottom-note">
            <span>✦</span>
            <p>Find pieces that feel like you.</p>
            <span>✦</span>
          </div>
        </section>
      </div>
    </main>
  );
}
