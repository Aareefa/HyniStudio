
import { NavLink } from "react-router-dom";
import {
  LayoutGrid, Shirt, Sparkles, Crown, ShoppingBag, Tags
} from "lucide-react";
import { categories } from "../data/products";
import "../Styles/Sidebar.css";

const icons = {
  All: LayoutGrid,
  Sarees: Sparkles,
  Frocks: Shirt,
  Skirts: Tags,
  Tops: Shirt,
  Kurtas: Shirt,
  Punjabi: Sparkles,
  Anarkali: Crown,
  Patiala: Sparkles,
  Jeans: Tags,
  "Crop Tops": Shirt,
  "Tank Tops": Shirt,
  "Short Tops": Shirt,
  "T-shirts": Shirt,
  Shirts: Shirt
};

export default function Sidebar({ selected, onSelect }) {
  return (
    <aside className="shop-sidebar">
      <h3>My Collections</h3>
      <p className="sidebar-caption">Find your perfect style</p>

      <div className="sidebar-links">
        {categories.map((category) => {
          const Icon = icons[category] || ShoppingBag;

          return (
            <button
              key={category}
              className={`sidebar-item ${
                selected === category ? "selected" : ""
              }`}
              onClick={() => onSelect(category)}
              aria-pressed={selected === category}
            >
              <Icon size={18} />
              <span>{category === "All" ? "All Products" : category}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-promo">
        <span>✦</span>
        <h4>Love a good deal?</h4>
        <p>Discover styles for your next special occasion.</p>
        <NavLink to="/products">Explore styles →</NavLink>
      </div>
    </aside>
  );
}
