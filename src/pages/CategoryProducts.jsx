import { Navigate, useParams } from "react-router-dom";
import Products from "./Products";
import { categories, toCategorySlug } from "../data/products";

export default function CategoryProducts(props) {
  const { categorySlug } = useParams();
  const category = categories.find(
    (item) => item !== "All" && toCategorySlug(item) === categorySlug
  );

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return <Products {...props} categoryOnly={category} />;
}