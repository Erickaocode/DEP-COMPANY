import { useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import AdminSettings from './pages/AdminSettings'
import AddProduct from './pages/AddProduct'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import RequireAdmin from './components/RequireAdmin'

import { CartItem } from './types'

type CartState = {
  cartItems: CartItem[]
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
}

// key pelo id: ao trocar de produto, tamanho/quantidade/loading voltam ao estado inicial
function ProductDetailRoute(props: CartState) {
  const { id } = useParams()
  return <ProductDetail key={id} {...props} />
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
      <Route path="/product/:id" element={<ProductDetailRoute cartItems={cartItems} setCartItems={setCartItems} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
      <Route path="/add-product" element={<RequireAdmin><AddProduct /></RequireAdmin>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}