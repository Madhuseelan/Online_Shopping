import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import {
    createOrder,
    createPayment,
    verifyPayment,
    cancelPayment,
    getAddresses,
    createAddress,
} from "../api/api";

import "./Checkout.css";


function Checkout() {

    const navigate = useNavigate();

    const {
        cartItems,
        clearCart,
    } = useCart();


    // =====================================================
    // STATE
    // =====================================================

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [addressLoading, setAddressLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // NEW ADDRESS
    // =====================================================

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });


    // =====================================================
    // LOAD ADDRESSES
    // =====================================================

    const loadAddresses = useCallback(async () => {

        try {

            setAddressLoading(true);
            setError("");

            const response =
                await getAddresses();

            let addressList = [];

            if (Array.isArray(response)) {

                addressList = response;

            } else if (
                Array.isArray(response?.results)
            ) {

                addressList = response.results;

            } else if (
                Array.isArray(response?.data)
            ) {

                addressList = response.data;
            }

            setAddresses(addressList);


            if (addressList.length > 0) {

                setSelectedAddress(
                    addressList[0].id
                );

                if (addressList[0].phone) {

                    setPhone(
                        addressList[0].phone
                    );
                }
            }

        } catch (err) {

            if (
                err.response?.status === 401
            ) {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                localStorage.removeItem(
                    "customer"
                );

                navigate("/login");

                return;
            }

            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Unable to load addresses."
            );

        } finally {

            setAddressLoading(false);
        }

    }, [navigate]);


    // =====================================================
    // LOGIN + LOAD ADDRESSES
    // =====================================================

 useEffect(() => {
    const token =
        localStorage.getItem("accessToken");

    if (!token) {
        navigate("/login");
        return;
    }

    const fetchAddresses = async () => {
        try {
            setAddressLoading(true);
            setError("");

            const response =
                await getAddresses();

            let addressList = [];

            if (Array.isArray(response)) {
                addressList = response;
            } else if (
                Array.isArray(response?.results)
            ) {
                addressList = response.results;
            } else if (
                Array.isArray(response?.data)
            ) {
                addressList = response.data;
            }

            setAddresses(addressList);

            if (addressList.length > 0) {
                setSelectedAddress(
                    addressList[0].id
                );

                if (addressList[0].phone) {
                    setPhone(
                        addressList[0].phone
                    );
                }
            }

        } catch (err) {

            if (err.response?.status === 401) {
                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Unable to load addresses."
            );

        } finally {
            setAddressLoading(false);
        }
    };

    fetchAddresses();

}, [navigate]);


    // =====================================================
    // ADDRESS INPUT
    // =====================================================

    const handleAddressChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setNewAddress(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    // =====================================================
    // CREATE ADDRESS
    // =====================================================

    const handleCreateAddress = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !newAddress.name.trim() ||
            !newAddress.phone.trim() ||
            !newAddress.address.trim() ||
            !newAddress.city.trim() ||
            !newAddress.state.trim() ||
            !newAddress.pincode.trim()
        ) {

            setError(
                "Please fill all address fields."
            );

            return;
        }


        try {

            setAddressLoading(true);

            await createAddress(
                newAddress
            );

            setSuccess(
                "Address added successfully."
            );

            await loadAddresses();

            setShowAddressForm(false);

            setNewAddress({
                name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
            });

        } catch (err) {

            if (
                err.response?.status === 401
            ) {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                localStorage.removeItem(
                    "customer"
                );

                navigate("/login");

                return;
            }


            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Unable to create address."
            );

        } finally {

            setAddressLoading(false);
        }
    };


    // =====================================================
    // GET PRICE
    // =====================================================

    const getPrice = (item) => {

        const price =
            item?.price ??
            item?.product?.price ??
            item?.product_price ??
            item?.unit_price ??
            item?.product?.unit_price ??
            0;

        const value =
            Number(price);

        return Number.isFinite(value)
            ? value
            : 0;
    };


    // =====================================================
    // GET QUANTITY
    // =====================================================

    const getQuantity = (item) => {

        const quantity =
            Number(
                item?.quantity ?? 1
            );

        return quantity > 0
            ? quantity
            : 1;
    };


    // =====================================================
    // GET PRODUCT ID
    // =====================================================

    const getProductId = (item) => {

        if (
            item?.product &&
            typeof item.product === "object" &&
            item.product.id != null
        ) {

            return Number(
                item.product.id
            );
        }


        if (
            item?.product != null &&
            (
                typeof item.product === "number" ||
                typeof item.product === "string"
            )
        ) {

            return Number(
                item.product
            );
        }


        if (
            item?.product_id != null
        ) {

            return Number(
                item.product_id
            );
        }


        if (
            item?.productId != null
        ) {

            return Number(
                item.productId
            );
        }


        return null;
    };


    // =====================================================
    // TOTAL
    // =====================================================

    const totalAmount =
        cartItems.reduce(
            (total, item) => {

                return (
                    total +
                    (
                        getPrice(item) *
                        getQuantity(item)
                    )
                );

            },
            0
        );


    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (err) => {

        const data =
            err?.response?.data;


        if (
            data &&
            typeof data === "object"
        ) {

            if (data.detail) {

                return String(
                    data.detail
                );
            }


            return Object.entries(data)
                .map(
                    ([field, message]) => {

                        const value =
                            Array.isArray(message)
                                ? message.join(", ")
                                : String(message);

                        return `${field}: ${value}`;
                    }
                )
                .join(" | ");
        }


        return (
            err?.message ||
            "Unable to process your order."
        );
    };


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {

        setError("");
        setSuccess("");


        // -------------------------------------------------
        // TOKEN
        // -------------------------------------------------

        const token =
            localStorage.getItem(
                "accessToken"
            );


        if (!token) {

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // CART
        // -------------------------------------------------

        if (
            !cartItems ||
            cartItems.length === 0
        ) {

            setError(
                "Your cart is empty."
            );

            return;
        }


        // -------------------------------------------------
        // ADDRESS
        // -------------------------------------------------

        if (!selectedAddress) {

            setError(
                "Please select a delivery address."
            );

            return;
        }


        // -------------------------------------------------
        // PHONE
        // -------------------------------------------------

        if (!phone.trim()) {

            setError(
                "Please enter your phone number."
            );

            return;
        }


        // -------------------------------------------------
        // TOTAL
        // -------------------------------------------------

        if (
            Number(totalAmount) <= 0
        ) {

            setError(
                "Invalid cart total."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // BUILD ITEMS
            // =================================================

            const items =
                cartItems.map(
                    (item) => {

                        const productId =
                            getProductId(item);

                        const quantity =
                            getQuantity(item);


                        if (!productId) {

                            throw new Error(
                                "Product ID is missing from the cart."
                            );
                        }


                        if (quantity <= 0) {

                            throw new Error(
                                "Invalid product quantity."
                            );
                        }


                        return {
                            product:
                                Number(
                                    productId
                                ),

                            quantity:
                                Number(
                                    quantity
                                ),
                        };
                    }
                );


            // =================================================
            // ORDER DATA
            // =================================================

           const orderData = {
    items: items,

    address: Number(selectedAddress),

    total_price:
        Number(
            totalAmount.toFixed(2)
        ),

    phone: phone.trim(),
};
            // =================================================
            // STEP 1
            // CREATE DJANGO ORDER
            // =================================================

            const orderResponse =
                await createOrder(
                    orderData
                );


            const orderId =
                orderResponse?.id;


            if (!orderId) {

                throw new Error(
                    "Order was created but no order ID was returned."
                );
            }


            // =================================================
            // STEP 2
            // CREATE RAZORPAY ORDER
            // =================================================

            const paymentResponse =
                await createPayment(
                    orderId,
                    "Online"
                );


            if (
                !paymentResponse ||
                !paymentResponse.razorpay_order_id
            ) {

                throw new Error(
                    "Unable to create Razorpay order."
                );
            }


            // =================================================
            // STEP 3
            // CHECK RAZORPAY
            // =================================================

            if (
                typeof window.Razorpay !==
                "function"
            ) {

                throw new Error(
                    "Razorpay Checkout is not loaded. Please refresh the page."
                );
            }


            // =================================================
            // PHONE
            // =================================================

            let customerPhone =
                phone.trim();


            if (
                /^[0-9]{10}$/.test(
                    customerPhone
                )
            ) {

                customerPhone =
                    `+91${customerPhone}`;
            }


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key:
                    paymentResponse.key_id,

                amount:
                    Number(
                        paymentResponse.amount_paise
                    ),

                currency:
                    paymentResponse.currency ||
                    "INR",

                name:
                    "SnapShop",

                description:
                    `Order #${orderId}`,

                order_id:
                    paymentResponse.razorpay_order_id,


                prefill: {

                    contact:
                        customerPhone,
                },


                notes: {

                    order_id:
                        String(orderId),

                },


                theme: {

                    color:
                        "#2d7655",

                },


                // =================================================
                // PAYMENT SUCCESS
                // =================================================

                handler:
                    async function (
                        razorpayResponse
                    ) {

                        try {

                            setLoading(true);

                            setError("");

                            setSuccess(
                                "Payment received. Verifying..."
                            );


                            const verificationResponse =
                                await verifyPayment({

                                    payment_id:
                                        paymentResponse.payment_id,

                                    razorpay_payment_id:
                                        razorpayResponse
                                            .razorpay_payment_id,

                                    razorpay_order_id:
                                        razorpayResponse
                                            .razorpay_order_id,

                                    razorpay_signature:
                                        razorpayResponse
                                            .razorpay_signature,

                                });


                            if (
                                !verificationResponse
                            ) {

                                throw new Error(
                                    "Payment verification failed."
                                );
                            }


                            // =====================================
                            // CLEAR CART ONLY AFTER SUCCESS
                            // =====================================

                            await clearCart();


                            setSuccess(
                                "Payment successful! Order confirmed."
                            );


                            setTimeout(() => {

                                navigate(
                                    "/my-orders"
                                );

                            }, 1200);


                        } catch (verifyError) {

                            console.error(
                                "PAYMENT VERIFICATION ERROR:",
                                verifyError
                            );


                            if (
                                verifyError
                                    ?.response
                                    ?.status === 401
                            ) {

                                localStorage.removeItem(
                                    "accessToken"
                                );

                                localStorage.removeItem(
                                    "refreshToken"
                                );

                                localStorage.removeItem(
                                    "customer"
                                );

                                navigate(
                                    "/login"
                                );

                                return;
                            }


                            setError(
                                getErrorMessage(
                                    verifyError
                                )
                            );

                            setSuccess("");

                        } finally {

                            setLoading(false);
                        }
                    },


                // =================================================
                // PAYMENT POPUP CLOSED
                // =================================================

                modal: {

                    ondismiss:
                        async function () {

                            try {

                                setLoading(true);

                                setError("");

                                await cancelPayment(
                                    paymentResponse.payment_id
                                );


                                setError(
                                    "Payment cancelled. Your stock has been restored."
                                );

                            } catch (cancelError) {

                                console.error(
                                    "PAYMENT CANCEL ERROR:",
                                    cancelError
                                );


                                setError(
                                    getErrorMessage(
                                        cancelError
                                    )
                                );

                            } finally {

                                setLoading(false);
                            }
                        },

                },

            };


            // =================================================
            // CREATE RAZORPAY
            // =================================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpay.on(
                "payment.failed",
                async function (
                    response
                ) {

                    console.error(
                        "RAZORPAY PAYMENT FAILED:",
                        response
                    );


                    try {

                        setLoading(true);

                        setError("");

                        await cancelPayment(
                            paymentResponse.payment_id
                        );


                    } catch (cancelError) {

                        console.error(
                            "STOCK RESTORE ERROR:",
                            cancelError
                        );

                    } finally {

                        setLoading(false);
                    }


                    const description =
                        response
                            ?.error
                            ?.description;


                    setError(
                        description ||
                        "Payment failed. Stock has been restored."
                    );

                    setSuccess("");

                }
            );


            // =================================================
            // OPEN RAZORPAY
            // =================================================

            razorpay.open();


        } catch (err) {

            console.error(
                "ORDER / PAYMENT ERROR:",
                err
            );


            if (
                err?.response?.status === 401
            ) {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                localStorage.removeItem(
                    "customer"
                );

                navigate("/login");

                return;
            }


            setError(
                getErrorMessage(err)
            );

            setSuccess("");

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (
        !cartItems ||
        cartItems.length === 0
    ) {

        return (

            <div className="checkout-page">

                <div className="checkout-container">

                    <h1>
                        Checkout
                    </h1>


                    <div className="checkout-empty">

                        <h2>
                            Your cart is empty
                        </h2>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="checkout-page">

            <div className="checkout-container">

                <h1>
                    Checkout
                </h1>


                {error && (

                    <div className="checkout-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="checkout-success">
                        {success}
                    </div>

                )}


                <div className="checkout-grid">


                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="checkout-left">


                        {/* CONTACT */}

                        <div className="checkout-section">

                            <h2>
                                Contact Information
                            </h2>


                            <label>
                                Phone Number
                            </label>


                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter phone number"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="checkout-section">

                            <div className="section-header">

                                <h2>
                                    Delivery Address
                                </h2>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddressForm(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    disabled={
                                        addressLoading ||
                                        loading
                                    }
                                >
                                    {showAddressForm
                                        ? "Cancel"
                                        : "+ Add Address"}
                                </button>

                            </div>


                            {addressLoading ? (

                                <p>
                                    Loading addresses...
                                </p>

                            ) : addresses.length > 0 ? (

                                <div className="address-list">

                                    {addresses.map(
                                        (addr) => (

                                            <label
                                                key={addr.id}
                                                className={`address-card ${
                                                    String(
                                                        selectedAddress
                                                    ) ===
                                                    String(
                                                        addr.id
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >

                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={
                                                        addr.id
                                                    }
                                                    checked={
                                                        String(
                                                            selectedAddress
                                                        ) ===
                                                        String(
                                                            addr.id
                                                        )
                                                    }
                                                    onChange={() => {

                                                        setSelectedAddress(
                                                            addr.id
                                                        );


                                                        if (
                                                            addr.phone
                                                        ) {

                                                            setPhone(
                                                                addr.phone
                                                            );
                                                        }

                                                    }}
                                                    disabled={
                                                        loading
                                                    }
                                                />


                                                <div>

                                                    <strong>
                                                        {addr.name}
                                                    </strong>


                                                    <p>
                                                        {addr.address}
                                                    </p>


                                                    <p>

                                                        {addr.city}

                                                        {addr.city &&
                                                        addr.state
                                                            ? ", "
                                                            : ""}

                                                        {addr.state}

                                                        {addr.pincode
                                                            ? ` - ${addr.pincode}`
                                                            : ""}

                                                    </p>


                                                    <p>
                                                        {addr.phone}
                                                    </p>

                                                </div>

                                            </label>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p>
                                    No saved addresses.
                                </p>

                            )}


                            {/* ADD ADDRESS */}

                            {showAddressForm && (

                                <form
                                    className="new-address-form"
                                    onSubmit={
                                        handleCreateAddress
                                    }
                                >

                                    <h3>
                                        Add New Address
                                    </h3>


                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={
                                            newAddress.name
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={
                                            newAddress.phone
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <textarea
                                        name="address"
                                        placeholder="Full Address"
                                        value={
                                            newAddress.address
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={
                                            newAddress.city
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={
                                            newAddress.state
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={
                                            newAddress.pincode
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        disabled={
                                            addressLoading
                                        }
                                    />


                                    <button
                                        type="submit"
                                        disabled={
                                            addressLoading
                                        }
                                    >

                                        {addressLoading
                                            ? "Saving..."
                                            : "Save Address"}

                                    </button>

                                </form>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div className="checkout-right">

                        <div className="order-summary">

                            <h2>
                                Order Summary
                            </h2>


                            {cartItems.map(
                                (item, index) => {

                                    const price =
                                        getPrice(item);

                                    const quantity =
                                        getQuantity(item);

                                    const itemTotal =
                                        price *
                                        quantity;


                                    return (

                                        <div
                                            className="checkout-item"
                                            key={
                                                item.id ||
                                                item.product?.id ||
                                                index
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        item.name ||
                                                        item.product?.name ||
                                                        "Product"
                                                    }
                                                </strong>


                                                <p>
                                                    Qty:{" "}
                                                    {quantity}
                                                </p>

                                            </div>


                                            <span>
                                                ₹
                                                {itemTotal.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </span>

                                        </div>

                                    );

                                }
                            )}


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>


                                <strong>
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>

                            </div>


                            <button
                                type="button"
                                className="place-order-btn"
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing..."
                                    : "Pay Now"}

                            </button>


                            <button
                                type="button"
                                className="back-cart-btn"
                                onClick={() =>
                                    navigate(
                                        "/cart"
                                    )
                                }
                                disabled={loading}
                            >
                                Back to Cart
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Checkout;