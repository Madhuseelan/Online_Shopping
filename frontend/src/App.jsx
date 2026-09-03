import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Category from "./components/Category";
import ProductList from "./components/ProductList";
import ProtectedRoute from "./components/ProtectedRoute";


// =====================================================
// PAGES
// =====================================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MyOrders from "./pages/MyOrders";
import MyAccount from "./pages/MyAccount";
import OrderDetails from "./pages/OrderDetails";


function App() {

    return (

        <CartProvider>

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                ROUTES
            ================================================= */}

            <Routes>


                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/category"
                    element={<Category />}
                />

                <Route
                    path="/product-list"
                    element={<ProductList />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />


                {/* =================================================
                    AUTHENTICATION ROUTES
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* =================================================
                    PROTECTED ROUTES
                ================================================= */}

                {/* CART */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />


                {/* CHECKOUT */}

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />


                {/* MY ACCOUNT */}

                <Route
                    path="/my-account"
                    element={
                        <ProtectedRoute>
                            <MyAccount />
                        </ProtectedRoute>
                    }
                />


                {/* MY ORDERS */}

                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    ORDER DETAILS
                ================================================= */}

                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    404 / FALLBACK
                ================================================= */}

                <Route
                    path="*"
                    element={<Home />}
                />

            </Routes>

        </CartProvider>

    );
}


export default App;