import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { WHOLESALE_MINIMUM_ORDER } from "../data/orderRules";

export default function ProductDetails({
  products = [],
  user,
  wishlist = [],
  onWishlist,
  onAdd
}) {
  const { id } = useParams();

  const product = products.find((item) => item.id === id);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  if (!product) {
    return (
      <main className="container empty-state">
        <h1>Product not found</h1>
        <Link to="/products" className="primary-btn">
          Back to Products
        </Link>
      </main>
    );
  }

  const selectedSize = size || product.sizes[0];
  const selectedColor = color || product.colors[0];

  const isWishlisted = wishlist.includes(product.id);

  return (
    <main className="container product-details page-enter">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> / {product.name}
      </div>

      <div className="details-layout">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-content">
          <span className="eyebrow">{product.category}</span>

          <h1>{product.name}</h1>

          <p className="product-rating">★ {product.rating} / 5</p>

          <p className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-code">Product code: {product.code}</p>

          <p className="details-description">{product.description}</p>

          <div className="option-group">
            <h3>Choose Size</h3>

            <div className="option-list">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  className={`option-btn ${
                    selectedSize === item ? "active" : ""
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Choose Colour</h3>

            <div className="option-list">
              {product.colors.map((item) => (
                <button
                  key={item}
                  className={`option-btn ${
                    selectedColor === item ? "active" : ""
                  }`}
                  onClick={() => setColor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="stock-label">
            {product.stock > 0 ? "In stock" : "Currently unavailable"}
          </p>

          <div className="details-actions">
            <button
              className="primary-btn"
              disabled={product.stock <= 0}
              onClick={() => onAdd(product, selectedSize, selectedColor)}
            >
              Add to Bag
            </button>

            <button
              className="outline-btn"
              onClick={() => onWishlist(product.id)}
            >
              {isWishlisted ? "♥ Saved" : "♡ Add to Wishlist"}
            </button>
          </div>

          <div className="details-note">
            <p>✦ Carefully selected fashion styles</p>
            <p>✦ Size and colour options available as listed</p>
            {user?.role === "Wholesaler" && (
              <p>
                ✦ Wholesale minimum order: ₹{WHOLESALE_MINIMUM_ORDER.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}