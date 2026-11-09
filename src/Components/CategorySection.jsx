
import { Link } from "react-router-dom";
import {
  Shirt,
  Sparkles,
  BriefcaseBusiness,
  Layers,
  Heart,
  Flower2,
  Gem,
  Star
} from "lucide-react";
import products, {
  categories,
  categoryImages,
  toCategorySlug
} from "../data/products";
import "../Styles/CategorySection.css";

const categoryDetails = {
  Sarees: { subtitle: "Timeless Indian drapes", icon: Sparkles },
  Frocks: { subtitle: "Short, long, and occasion styles", icon: Heart },
  Skirts: { subtitle: "Printed and pleated", icon: Flower2 },
  Tops: { subtitle: "Everyday essentials", icon: Shirt },
  Kurtas: { subtitle: "Indian everyday wear", icon: Shirt },
  Punjabi: { subtitle: "Colourful Punjabi suits", icon: Gem },
  Anarkali: { subtitle: "Flared festive silhouettes", icon: Sparkles },
  Patiala: { subtitle: "Classic pleated sets", icon: Flower2 },
  Jeans: { subtitle: "Everyday denim styles", icon: Layers },
  "Crop Tops": { subtitle: "Modern cropped styles", icon: Heart },
  "Tank Tops": { subtitle: "Lightweight layers", icon: Shirt },
  "Short Tops": { subtitle: "Contemporary short tops", icon: Shirt },
  "T-shirts": { subtitle: "Casual cotton staples", icon: Star },
  Shirts: { subtitle: "Crisp western classics", icon: BriefcaseBusiness }
};

const items = categories
  .filter((name) => name !== "All")
  .map((name) => ({
    name,
    ...(categoryDetails[name] || { subtitle: "Explore the collection", icon: Shirt }),
    image: categoryImages[name] || products.find((product) => product.category === name)?.image
  }));

export default function CategorySection() {
  return (
    <section className="section container" id="categories">
      <div className="section-heading">
        <span className="eyebrow">INDIAN & WESTERN WOMEN'S WEAR</span>
        <h2>Shop by category</h2>
        <p>
          {categories.length - 1} categories · {products.length} real garment photos.
          Browse Indian classics and western styles displayed on mannequins and hangers.
        </p>
      </div>

      <div className="category-grid">
        {items.map(({ name, subtitle, icon: Icon, image }) => (
          <Link
            key={name}
            to={`/category/${toCategorySlug(name)}`}
            className="category-tile"
          >
            <img src={image} alt={name} loading="lazy" />
            <div className="category-overlay">
              <Icon size={22} />
              <h3>{name}</h3>
              <p>{subtitle}</p>
              <span>Explore collection →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
