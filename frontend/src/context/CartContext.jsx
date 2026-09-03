/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/api";

// =====================================================
// CART CONTEXT
// =====================================================

const CartContext = createContext(null);

// =====================================================
// EMPTY CART
// =====================================================

const EMPTY_CART = {
    id: null,
    items: [],
    total_items: 0,
    total_price: 0,
};

// =====================================================
// CART PROVIDER
// =====================================================

export function CartProvider({ children }) {
    const [cart, setCart] = useState(EMPTY_CART);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =================================================
    // LOAD CART
    // =================================================

    const loadCart = useCallback(async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setCart(EMPTY_CART);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get("cart/");

            console.log("DJANGO CART:", response.data);

            setCart(response.data);
        } catch (error) {
            console.error("LOAD CART ERROR:", error);

            if (error.response) {
                console.error("STATUS:", error.response.status);
                console.error("DATA:", error.response.data);
            }

            setCart(EMPTY_CART);

            if (error.response?.status === 401) {
                setError("Please login again.");
            } else {
                setError(error.response?.data?.detail || "Unable to load cart.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // =================================================
    // LOAD CART ON START
    // =================================================

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCart();
    }, [loadCart]);

    // =================================================
    // ADD TO CART
    // =================================================

    const addToCart = async (product, quantity = 1) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            const message = "Please login before adding products to cart.";
            setError(message);
            throw new Error(message);
        }

        if (!product?.id) {
            const message = "Product ID is missing.";
            setError(message);
            throw new Error(message);
        }

        try {
            setError("");

            const response = await api.post("cart/add/", {
                product: product.id,
                quantity: quantity,
            });

            console.log("ADDED TO CART:", response.data);

            setCart(response.data);

            return response.data;
        } catch (error) {
            console.error("ADD CART ERROR:", error);

            const message = error.response?.data?.detail || "Unable to add product to cart.";

            setError(message);

            throw error;
        }
    };

    // =================================================
    // UPDATE CART ITEM
    // =================================================

    const updateCartItem = async (itemId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(itemId);
        }

        try {
            setError("");

            const response = await api.put(`cart/update/${itemId}/`, {
                quantity: quantity,
            });

            console.log("UPDATED CART:", response.data);

            setCart(response.data);

            return response.data;
        } catch (error) {
            console.error("UPDATE CART ERROR:", error);

            const message = error.response?.data?.detail || "Unable to update cart.";

            setError(message);

            throw error;
        }
    };

    // =================================================
    // INCREASE
    // =================================================

    const increaseQuantity = async (item) => {
        if (!item) {
            return;
        }

        return updateCartItem(item.id, Number(item.quantity) + 1);
    };

    // =================================================
    // DECREASE
    // =================================================

    const decreaseQuantity = async (item) => {
        if (!item) {
            return;
        }

        if (Number(item.quantity) <= 1) {
            return removeFromCart(item.id);
        }

        return updateCartItem(item.id, Number(item.quantity) - 1);
    };

    // =================================================
    // REMOVE
    // =================================================

    const removeFromCart = async (itemId) => {
        try {
            setError("");

            const response = await api.delete(`cart/remove/${itemId}/`);

            console.log("REMOVED FROM CART:", response.data);

            setCart(response.data);

            return response.data;
        } catch (error) {
            console.error("REMOVE CART ERROR:", error);

            const message = error.response?.data?.detail || "Unable to remove product.";

            setError(message);

            throw error;
        }
    };

    // =================================================
    // CLEAR CART
    // =================================================

    const clearCart = async () => {
        try {
            setError("");

            const response = await api.delete("cart/clear/");

            console.log("CART CLEARED:", response.data);

            setCart(response.data);

            return response.data;
        } catch (error) {
            console.error("CLEAR CART ERROR:", error);

            const message = error.response?.data?.detail || "Unable to clear cart.";

            setError(message);

            throw error;
        }
    };

    // =================================================
    // CART DATA
    // =================================================

    const cartItems = cart?.items || [];
    const cartCount = Number(cart?.total_items || 0);
    const cartTotal = Number(cart?.total_price || 0);

    // =================================================
    // PROVIDER
    // =================================================

    return (
        <CartContext.Provider
            value={{
                cart,
                cartItems,
                items: cartItems,
                cartCount,
                cartTotal,
                loading,
                error,
                loadCart,
                addToCart,
                updateCartItem,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// =====================================================
// USE CART
// =====================================================

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}