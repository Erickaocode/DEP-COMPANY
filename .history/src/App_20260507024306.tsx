import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import AdminSettings from './pages/AdminSettings'
import AddProduct from './pages/AddProduct'

import { CartItem, Product, StoreSettings } from './types'
import { getCartItems, getProducts, getStoreSettings } from './services/storage'

const initialCart = getCartItems()
const initialProducts = getProducts()
const initialSettings = getStoreSettings() ?? { store_name: 'Minha Loja' }

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart)
  const [products] = useState<Product[]>(initialProducts)
  const [storeSettings] = useState<StoreSettings>(initialSettings)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/products"
        element={
          <Products
            products={products}
            cartItems={cartItems}
            storeSettings={storeSettings}
          />
        }
      />
      <Route
        path="/cart"
        element={
          <Cart
            initialCartItems={cartItems}
            storeSettings={storeSettings}
          />
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProductDetail
            products={products}
            cartItems={cartItems}
            setCartItems={setCartItems}
            storeSettings={storeSettings}
          />
        }
      />
      <Route path="/admin" element={<AdminSettings />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  )
}