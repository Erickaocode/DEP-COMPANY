import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import AdminSettings from './pages/AdminSettings'
import AddProduct from './pages/AddProduct'

import { CartItem, Product, StoreSettings } from './types'
import { getCartItems, getProducts, getStoreSettings } from './services/storage'

function loadInitialState() {
  return {
    cartItems: getCartItems(),
    products: getProducts(),
    storeSettings: getStoreSettings() ?? { store_name: 'Minha Loja' },
  }
}

export default function App() {
  const initial = loadInitialState()
  const [cartItems, setCartItems] = useState<CartItem[]>(initial.cartItems)
  const [products] = useState<Product[]>(initial.products)
  const [storeSettings] = useState<StoreSettings>(initial.storeSettings)

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

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