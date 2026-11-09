import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/ProductCard.css";

export default function ProductCard({
  product,
  wished,
  onWishlist,
  onAdd
}) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-photo"
      >
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
      </Link>

      <button
        className={`wishlist-btn ${wished ? "is-wished" : ""}`}
        onClick={() => onWishlist(product.id)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
      >
        <Heart size={19} fill={wished ? "currentColor" : "none"} />
      </button>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="product-code">{product.code}</span>
        </div>

        <div className="product-prices">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
          <span>{discount}% off</span>
        </div>

        <button
          className="add-bag-btn"
          onClick={() => onAdd(product)}
        >
          <ShoppingBag size={17} /> Add to bag
        </button>
      </div>
    </article>
  );
}
