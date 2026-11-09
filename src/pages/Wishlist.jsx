import { Link } from "react-router-dom";

export default function Wishlist({
  products = [],
  wishlist = [],
  onWishlist,
  onAdd
}) {
  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <main className="container wishlist-page page-enter">
      <div className="page-heading">
        <span className="eyebrow">YOUR FAVOURITES</span>
        <h1>My Wishlist ♥</h1>
        <p>Keep your favourite styles together.</p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here later.</p>

          <Link to="/products" className="primary-btn">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {savedProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="product-image"
              >
                <img src={product.image} alt={product.name} />
              </Link>

              <button
                className="wishlist-btn active"
                onClick={() => onWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                ♥
              </button>

              <div className="product-info">
                <span className="product-category">{product.category}</span>

                <Link to={`/products/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

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