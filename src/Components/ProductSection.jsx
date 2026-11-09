import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import "../Styles/ProductSection.css";

export default function ProductSection({
  products,
  wishlist,
  onWishlist,
  onAdd
}) {
  return (
    <section className="section container" id="featured">
      <div className="featured-heading">
        <div className="section-heading">
          <span className="eyebrow">HANDPICKED FOR YOU</span>
          <h2>Customer favourites</h2>
          <p>Discover beautiful styles loved by our shoppers.</p>
        </div>

        <Link to="/products" className="featured-link">
          View all <ArrowRight size={17} />
        </Link>
      </div>

      <div className="product-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wished={wishlist.includes(product.id)}
            onWishlist={onWishlist}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}
