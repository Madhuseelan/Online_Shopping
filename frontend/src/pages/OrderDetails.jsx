import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getOrderDetails,
    cancelOrder,
} from "../api/api";

import "./OrderDetails.css";


function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "/images/product-placeholder.jpg";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `http://127.0.0.1:8000${image}`;
        }

        return `http://127.0.0.1:8000/${image}`;
    };


    // =====================================================
    // PRODUCT IMAGE
    // =====================================================

    const getItemImage = (item) => {

        return getImageUrl(
            item?.product_image ||
            item?.product?.image ||
            item?.product?.image_url ||
            item?.image ||
            ""
        );
    };


    // =====================================================
    // PRODUCT NAME
    // =====================================================

    const getItemName = (item) => {

        return (
            item?.product_name ||
            item?.product?.name ||
            "Product"
        );
    };


    // =====================================================
    // ITEM QUANTITY
    // =====================================================

    const getItemQuantity = (item) => {

        const quantity =
            Number(item?.quantity ?? 1);

        return quantity > 0
            ? quantity
            : 1;
    };


    // =====================================================
    // ITEM PRICE
    // =====================================================

    const getItemPrice = (item) => {

        const price =
            Number(item?.price ?? 0);

        return Number.isFinite(price)
            ? price
            : 0;
    };


    // =====================================================
    // ITEM SUBTOTAL
    // =====================================================

    const getItemSubtotal = (item) => {

        const subtotal =
            Number(item?.subtotal);

        if (Number.isFinite(subtotal)) {
            return subtotal;
        }

        return (
            getItemPrice(item) *
            getItemQuantity(item)
        );
    };


    // =====================================================
    // LOAD ORDER
    // =====================================================

    useEffect(() => {

        const fetchOrder = async () => {

            const token =
                localStorage.getItem(
                    "accessToken"
                );

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                setLoading(true);
                setError("");

                const data =
                    await getOrderDetails(id);

                setOrder(data);

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
                    "Unable to load order details."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchOrder();

    }, [id, navigate]);


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setCancelLoading(true);
            setError("");
            setSuccess("");

            const updatedOrder =
                await cancelOrder(id);

            setOrder(updatedOrder);

            setSuccess(
                "Order cancelled successfully."
            );

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
                "Unable to cancel order."
            );

        } finally {

            setCancelLoading(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <section className="order-details-page">

                <div className="order-details-loading">

                    <div className="loader"></div>

                    <p>
                        Loading order details...
                    </p>

                </div>

            </section>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !order) {

        return (
            <section className="order-details-page">

                <div className="order-details-error">

                    <h1>
                        Order Details
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/my-orders"
                        className="back-orders-btn"
                    >
                        Back to My Orders
                    </Link>

                </div>

            </section>
        );
    }


    // =====================================================
    // NO ORDER
    // =====================================================

    if (!order) {
        return null;
    }


    // =====================================================
    // ORDER VALUES
    // =====================================================

    const status =
        order?.status || "Pending";

    const statusLower =
        String(status).toLowerCase();


    const totalPrice =
        Number(
            order?.total_price ??
            order?.total ??
            0
        );


    const address =
        typeof order?.address === "object"

            ? [
                order.address?.name,
                order.address?.address,
                order.address?.city,
                order.address?.state,
                order.address?.pincode,
            ]
                .filter(Boolean)
                .join(", ")

            : order?.address ||
              "Address not available";


    // =====================================================
    // ORDER ITEMS
    // =====================================================

    const items =
        Array.isArray(order?.items) &&
        order.items.length > 0

            ? order.items

            : [
                {
                    product_name:
                        order?.product_name,

                    product_image:
                        order?.product_image,

                    product:
                        order?.product,

                    quantity:
                        order?.quantity,

                    price:
                        totalPrice,
                },
            ];


    // =====================================================
    // STATUS
    // =====================================================

    const canCancel =
        statusLower === "pending" ||
        statusLower === "confirmed";

    const isConfirmed =
        statusLower === "confirmed";

    const isShipped =
        statusLower === "shipped" ||
        statusLower === "delivered";

    const isDelivered =
        statusLower === "delivered";

    const isCancelled =
        statusLower === "cancelled";


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <section className="order-details-page">

            <div className="order-details-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <Link
                    to="/my-orders"
                    className="back-orders-link"
                >
                    ← Back to My Orders
                </Link>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="order-details-header">

                    <div>

                        <p className="order-label">
                            ORDER DETAILS
                        </p>

                        <h1>
                            Order #{order.id}
                        </h1>

                        <p>
                            Your order information
                        </p>

                    </div>


                    <span
                        className={`order-details-status ${
                            isCancelled
                                ? "cancelled-status"
                                : ""
                        }`}
                    >
                        {status}
                    </span>

                </div>


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="checkout-success">
                        {success}
                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="checkout-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <div className="order-details-card">

                    <h2>
                        Products
                    </h2>


                    <div className="order-detail-items">

                        {items.map(
                            (item, index) => {

                                const image =
                                    getItemImage(
                                        item
                                    );

                                const name =
                                    getItemName(
                                        item
                                    );

                                const quantity =
                                    getItemQuantity(
                                        item
                                    );

                                const price =
                                    getItemPrice(
                                        item
                                    );

                                const subtotal =
                                    getItemSubtotal(
                                        item
                                    );


                                return (

                                    <div
                                        className="order-detail-item"
                                        key={
                                            item?.id ||
                                            item?.product ||
                                            index
                                        }
                                    >

                                        <div className="order-product-image">

                                            <img
                                                src={image}
                                                alt={name}
                                                onError={(
                                                    e
                                                ) => {

                                                    if (
                                                        !e.currentTarget.src.includes(
                                                            "product-placeholder.jpg"
                                                        )
                                                    ) {
                                                        e.currentTarget.src =
                                                            "/images/product-placeholder.jpg";
                                                    }

                                                }}
                                            />

                                        </div>


                                        <div className="order-product-info">

                                            <h3>
                                                {name}
                                            </h3>

                                            <p>
                                                Unit Price:
                                                <strong>
                                                    {" "}
                                                    ₹
                                                    {price.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </strong>
                                            </p>

                                            <p>
                                                Quantity:
                                                <strong>
                                                    {" "}
                                                    {quantity}
                                                </strong>
                                            </p>

                                        </div>


                                        <div className="order-item-subtotal">

                                            <span>
                                                Subtotal
                                            </span>

                                            <strong>
                                                ₹
                                                {subtotal.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                </div>


                {/* =================================================
                    DELIVERY
                ================================================= */}

                <div className="order-details-card">

                    <h2>
                        Delivery Information
                    </h2>


                    <div className="details-grid">

                        <div className="details-item">

                            <span>
                                Delivery Address
                            </span>

                            <strong>
                                {address}
                            </strong>

                        </div>


                        <div className="details-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {order.phone ||
                                    "Not available"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="order-details-card">

                    <h2>
                        Order Summary
                    </h2>


                    {items.map(
                        (item, index) => (

                            <div
                                className="summary-row"
                                key={
                                    item?.id ||
                                    item?.product ||
                                    index
                                }
                            >

                                <span>

                                    {getItemName(
                                        item
                                    )}

                                    {" × "}

                                    {getItemQuantity(
                                        item
                                    )}

                                </span>

                                <span>

                                    ₹
                                    {getItemSubtotal(
                                        item
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}

                                </span>

                            </div>
                        )
                    )}


                    <div className="summary-total-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {totalPrice.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    ORDER STATUS
                ================================================= */}

                <div className="order-details-card">

                    <h2>
                        Order Status
                    </h2>


                    {isCancelled ? (

                        <div className="cancelled-order-message">
                            Order Cancelled
                        </div>

                    ) : (

                        <div className="order-status-timeline">


                            <div className="status-step active">

                                <span></span>

                                <strong>
                                    Ordered
                                </strong>

                            </div>


                            <div
                                className={
                                    isConfirmed ||
                                    isShipped ||
                                    isDelivered
                                        ? "status-step active"
                                        : "status-step"
                                }
                            >

                                <span></span>

                                <strong>
                                    Confirmed
                                </strong>

                            </div>


                            <div
                                className={
                                    isShipped
                                        ? "status-step active"
                                        : "status-step"
                                }
                            >

                                <span></span>

                                <strong>
                                    Shipped
                                </strong>

                            </div>


                            <div
                                className={
                                    isDelivered
                                        ? "status-step active"
                                        : "status-step"
                                }
                            >

                                <span></span>

                                <strong>
                                    Delivered
                                </strong>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    CANCEL ORDER
                ================================================= */}

                {canCancel && (

                    <button
                        type="button"
                        className="cancel-order-btn"
                        onClick={
                            handleCancelOrder
                        }
                        disabled={
                            cancelLoading
                        }
                    >

                        {cancelLoading
                            ? "Cancelling..."
                            : "Cancel Order"}

                    </button>

                )}


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Link
                    to="/my-orders"
                    className="back-orders-btn"
                >
                    Back to My Orders
                </Link>

            </div>

        </section>
    );
}


export default OrderDetails;