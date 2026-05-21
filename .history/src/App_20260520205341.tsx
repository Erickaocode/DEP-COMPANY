import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import AdminSettings from './pages/AdminSettings'
import AddProduct from './pages/AddProduct'

import { CartItem } from './types'

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
      <Route path="/product/:id" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
      <Route path="/admin" element={<AdminSettings />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  )
}