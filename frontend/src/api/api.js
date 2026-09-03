import axios from "axios";


// =====================================================
// AXIOS API
// =====================================================

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});


// =====================================================
// REQUEST INTERCEPTOR
// ADD JWT TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("accessToken");

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        // Keep the original Axios error.
        // Individual pages can handle:
        // 400, 401, 404, 500, etc.

        return Promise.reject(error);
    }
);


// =====================================================
// PRODUCTS
// =====================================================

// GET /api/products/

export async function getProducts() {

    const response =
        await api.get(
            "products/"
        );

    return response.data;
}


// =====================================================
// SINGLE PRODUCT
// =====================================================

// GET /api/products/1/

export async function getProduct(id) {

    const response =
        await api.get(
            `products/${id}/`
        );

    return response.data;
}


// =====================================================
// CART
// =====================================================

// GET /api/cart/

export async function getCart() {

    const response =
        await api.get(
            "cart/"
        );

    return response.data;
}


// =====================================================
// ADD TO CART
// =====================================================

// POST /api/add/

export async function addToCart(
    productId,
    quantity = 1
) {

    const response =
        await api.post(
            "add/",
            {
                product: Number(productId),
                quantity: Number(quantity),
            }
        );

    return response.data;
}


// =====================================================
// UPDATE CART
// =====================================================

// PUT /api/update/1/

export async function updateCart(
    itemId,
    quantity
) {

    const response =
        await api.put(
            `update/${itemId}/`,
            {
                quantity: Number(quantity),
            }
        );

    return response.data;
}


// =====================================================
// REMOVE CART ITEM
// =====================================================

// DELETE /api/remove/1/

export async function removeFromCart(
    itemId
) {

    const response =
        await api.delete(
            `remove/${itemId}/`
        );

    return response.data;
}


// =====================================================
// CLEAR CART
// =====================================================

// DELETE /api/clear/

export async function clearCart() {

    const response =
        await api.delete(
            "clear/"
        );

    return response.data;
}


// =====================================================
// CREATE ORDER
// =====================================================

// POST /api/orders/

export async function createOrder(
    orderData
) {

    const token =
        localStorage.getItem(
            "accessToken"
        );

    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );
    }

    const response =
        await api.post(
            "orders/",
            orderData
        );

    return response.data;
}


// =====================================================
// MY ORDERS
// =====================================================

// GET /api/orders/my-orders/

export async function getMyOrders() {

    const response =
        await api.get(
            "orders/my-orders/"
        );

    return response.data;
}


// =====================================================
// ORDER DETAILS
// =====================================================

// GET /api/orders/1/

export async function getOrderDetails(
    id
) {

    const response =
        await api.get(
            `orders/${id}/`
        );

    return response.data;
}


// =====================================================
// CANCEL ORDER
// =====================================================

// POST /api/orders/1/cancel/

export async function cancelOrder(
    id
) {

    const response =
        await api.post(
            `orders/${id}/cancel/`
        );

    return response.data;
}


// =====================================================
// CURRENT CUSTOMER
// =====================================================

// GET /api/accounts/profile/

export async function getCurrentCustomer() {

    const response =
        await api.get(
            "accounts/profile/"
        );

    return response.data;
}


// =====================================================
// GET ALL ADDRESSES
// =====================================================

// GET /api/addresses/

export async function getAddresses() {

    const response =
        await api.get(
            "addresses/"
        );

    return response.data;
}


// =====================================================
// CREATE ADDRESS
// =====================================================

// POST /api/addresses/

export async function createAddress(
    addressData
) {

    const response =
        await api.post(
            "addresses/",
            addressData
        );

    return response.data;
}


// =====================================================
// GET SINGLE ADDRESS
// =====================================================

// GET /api/addresses/1/

export async function getAddress(
    id
) {

    const response =
        await api.get(
            `addresses/${id}/`
        );

    return response.data;
}


// =====================================================
// UPDATE ADDRESS
// =====================================================

// PUT /api/addresses/1/

export async function updateAddress(
    id,
    addressData
) {

    const response =
        await api.put(
            `addresses/${id}/`,
            addressData
        );

    return response.data;
}


// =====================================================
// DELETE ADDRESS
// =====================================================

// DELETE /api/addresses/1/

export async function deleteAddress(
    id
) {

    const response =
        await api.delete(
            `addresses/${id}/`
        );

    return response.data;
}


// =====================================================
// CREATE RAZORPAY ORDER
// POST /api/payments/
// =====================================================

export async function createPayment(
    orderId,
    paymentMethod = "Online"
) {

    if (!orderId) {

        throw new Error(
            "Order ID is required."
        );
    }

    const response =
        await api.post(
            "payments/",
            {
                order_id:
                    Number(orderId),

                payment_method:
                    paymentMethod,
            }
        );

    return response.data;
}


// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payments/verify/
// =====================================================

export async function verifyPayment(
    paymentData
) {

    if (
        !paymentData ||
        !paymentData.payment_id ||
        !paymentData.razorpay_payment_id ||
        !paymentData.razorpay_order_id ||
        !paymentData.razorpay_signature
    ) {

        throw new Error(
            "Incomplete payment verification data."
        );
    }

    const response =
        await api.post(
            "payments/verify/",
            paymentData
        );

    return response.data;
}


// =====================================================
// PAYMENT DETAILS
// =====================================================

// GET /api/payments/1/

export async function getPaymentDetails(
    paymentId
) {

    const response =
        await api.get(
            `payments/${paymentId}/`
        );

    return response.data;
}


// =====================================================
// LOGOUT
// =====================================================

export function logoutCustomer() {

    localStorage.removeItem(
        "accessToken"
    );

    localStorage.removeItem(
        "refreshToken"
    );

    localStorage.removeItem(
        "customer"
    );

    localStorage.removeItem(
        "rememberMe"
    );
}
// =====================================================
// CANCEL PAYMENT
// POST /api/payments/cancel/
// =====================================================

export async function cancelPayment(
    paymentId
) {

    const response =
        await api.post(
            "payments/cancel/",
            {
                payment_id:
                    Number(paymentId),
            }
        );

    return response.data;
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;