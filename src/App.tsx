import { Routes, Route } from "react-router-dom";

// pages
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminSettings from "./pages/AdminSettings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/produto/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<AdminSettings />} />
    </Routes>
  );
}
