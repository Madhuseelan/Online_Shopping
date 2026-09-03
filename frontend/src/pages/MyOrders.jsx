import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyOrders } from "../api/api";

import "./MyOrders.css";


function MyOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // API BASE URL
    // =====================================================

    const API_BASE_URL =
        "http://127.0.0.1:8000";


    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        if (
            typeof image !== "string"
        ) {

            return "";
        }


        const cleanImage =
            image.trim();


        if (!cleanImage) {
            return "";
        }


        // Already complete URL
        if (
            cleanImage.startsWith("http://") ||
            cleanImage.startsWith("https://")
        ) {

            return cleanImage;
        }


        // Django media URL
        if (
            cleanImage.startsWith("/media/")
        ) {

            return (
                `${API_BASE_URL}${cleanImage}`
            );
        }


        // Any other root-relative URL
        if (
            cleanImage.startsWith("/")
        ) {

            return (
                `${API_BASE_URL}${cleanImage}`
            );
        }


        // Relative image path
        return (
            `${API_BASE_URL}/${cleanImage}`
        );
    };


    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    const getItemImage = (item) => {

        const image =
            item?.product_image ||
            item?.product?.image ||
            item?.product?.image_url ||
            item?.image_url ||
            item?.image ||
            "";


        return getImageUrl(image);
    };


    // =====================================================
    // GET PRODUCT NAME
    // =====================================================

    const getItemName = (item) => {

        return (
            item?.product_name ||
            item?.product?.name ||
            item?.name ||
            "Product"
        );
    };


    // =====================================================
    // GET QUANTITY
    // =====================================================

    const getItemQuantity = (item) => {

        const quantity =
            Number(
                item?.quantity ?? 1
            );


        if (
            Number.isFinite(quantity) &&
            quantity > 0
        ) {

            return quantity;
        }


        return 1;
    };


    // =====================================================
    // GET PRICE
    // =====================================================

    const getItemPrice = (item) => {

        const price =
            Number(
                item?.price ??
                item?.product_price ??
                item?.product?.price ??
                0
            );


        return Number.isFinite(price)
            ? price
            : 0;
    };


    // =====================================================
    // GET SUBTOTAL
    // =====================================================

    const getItemSubtotal = (item) => {

        const subtotal =
            Number(
                item?.subtotal
            );


        if (
            Number.isFinite(subtotal) &&
            subtotal >= 0
        ) {

            return subtotal;
        }


        return (
            getItemPrice(item) *
            getItemQuantity(item)
        );
    };


    // =====================================================
    // GET ADDRESS
    // =====================================================

    const getAddress = (order) => {

        const address =
            order?.address;


        if (
            address &&
            typeof address === "object"
        ) {

            return [
                address.name,
                address.address,
                address.city,
                address.state,
                address.pincode,
            ]
                .filter(Boolean)
                .join(", ");
        }


        if (
            typeof address === "string"
        ) {

            return address;
        }


        return (
            order?.address_text ||
            "Address not available"
        );
    };


    // =====================================================
    // NORMALIZE STATUS
    // =====================================================

    const getStatus = (order) => {

        return String(
            order?.status ||
            "Pending"
        )
            .trim()
            .toLowerCase();
    };


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        const labels = {

            pending:
                "Pending",

            confirmed:
                "Confirmed",

            processing:
                "Processing",

            shipped:
                "Shipped",

            "out for delivery":
                "Out for Delivery",

            delivered:
                "Delivered",

            cancelled:
                "Cancelled",

            failed:
                "Failed",

            returned:
                "Returned",

            refunded:
                "Refunded",
        };


        return (
            labels[status] ||
            "Pending"
        );
    };


    // =====================================================
    // TIMELINE
    // =====================================================

    const timelineSteps = [
        {
            key: "ordered",
            label: "Ordered",
        },

        {
            key: "confirmed",
            label: "Confirmed",
        },

        {
            key: "processing",
            label: "Processing",
        },

        {
            key: "shipped",
            label: "Shipped",
        },

        {
            key: "out for delivery",
            label: "Out for Delivery",
        },

        {
            key: "delivered",
            label: "Delivered",
        },
    ];


    // =====================================================
    // TIMELINE INDEX
    // =====================================================

    const getTimelineIndex = (status) => {

        if (status === "pending") {
            return 0;
        }


        const index =
            timelineSteps.findIndex(
                (step) =>
                    step.key === status
            );


        return index >= 0
            ? index
            : 0;
    };


    // =====================================================
    // GET TIMELINE
    // =====================================================

    const getTimeline = (status) => {

        const currentIndex =
            getTimelineIndex(
                status
            );


        return timelineSteps.map(
            (
                step,
                index
            ) => {

                return {
                    ...step,

                    completed:
                        index <=
                        currentIndex,

                    current:
                        index ===
                        currentIndex,
                };
            }
        );
    };


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {

        let mounted = true;


        const fetchOrders =
            async () => {

                const token =
                    localStorage.getItem(
                        "accessToken"
                    );


                if (!token) {

                    navigate(
                        "/login"
                    );

                    return;
                }


                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getMyOrders();


                    let orderList = [];


                    if (
                        Array.isArray(data)
                    ) {

                        orderList =
                            data;

                    } else if (
                        Array.isArray(
                            data?.results
                        )
                    ) {

                        orderList =
                            data.results;

                    } else if (
                        Array.isArray(
                            data?.data
                        )
                    ) {

                        orderList =
                            data.data;
                    }


                    if (mounted) {

                        setOrders(
                            orderList
                        );
                    }


                } catch (err) {

                    console.error(
                        "MY ORDERS ERROR:",
                        err
                    );


                    if (
                        err.response
                            ?.status ===
                        401
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


                    if (mounted) {

                        setError(
                            err.response
                                ?.data
                                ?.detail ||

                            err.response
                                ?.data
                                ?.message ||

                            err.message ||

                            "Unable to load your orders."
                        );
                    }


                } finally {

                    if (mounted) {

                        setLoading(
                            false
                        );
                    }
                }
            };


        fetchOrders();


        return () => {

            mounted = false;
        };

    }, [navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section className="orders-page">

                <div className="orders-loading">

                    <div className="loader"></div>

                    <p>
                        Loading Orders...
                    </p>

                </div>

            </section>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <section className="orders-page">

                <div className="empty-orders">

                    <div className="empty-icon">
                        ⚠️
                    </div>


                    <h1>
                        My Orders
                    </h1>


                    <p>
                        {error}
                    </p>


                    <button
                        type="button"
                        className="shop-btn"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </section>
        );
    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        orders.length === 0
    ) {

        return (

            <section className="orders-page">

                <div className="empty-orders">

                    <div className="empty-icon">
                        🛒
                    </div>


                    <h1>
                        My Orders
                    </h1>


                    <p>
                        No Orders Found
                    </p>


                    <Link
                        to="/products"
                        className="shop-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </section>
        );
    }


    // =====================================================
    // ORDERS
    // =====================================================

    return (

        <section className="orders-page">

            <div className="orders-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="orders-header">

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        Track your recent purchases
                    </p>

                </div>


                {/* =================================================
                    ORDER LIST
                ================================================= */}

                {orders.map(
                    (order) => {

                        const status =
                            getStatus(
                                order
                            );


                        const statusLabel =
                            getStatusLabel(
                                status
                            );


                        const address =
                            getAddress(
                                order
                            );


                        const totalPrice =
                            Number(
                                order?.total_price ??
                                order?.total ??
                                0
                            );


                        // =================================================
                        // MULTI-PRODUCT / LEGACY
                        // =================================================

                        const items =
                            Array.isArray(
                                order?.items
                            ) &&
                            order.items.length > 0

                                ? order.items

                                : [
                                      {
                                          product:
                                              order?.product,

                                          product_name:
                                              order?.product_name,

                                          product_image:
                                              order?.product_image,

                                          product_price:
                                              order?.product_price,

                                          quantity:
                                              order?.quantity,

                                          price:
                                              order?.product_price ??
                                              order?.total_price,

                                          subtotal:
                                              order?.total_price,
                                      },
                                  ];


                        // =================================================
                        // STATUS
                        // =================================================

                        const isCancelled =
                            status ===
                            "cancelled";


                        const isFailed =
                            status ===
                            "failed";


                        const isReturned =
                            status ===
                            "returned";


                        const isRefunded =
                            status ===
                            "refunded";


                        const isSpecialStatus =
                            isCancelled ||
                            isFailed ||
                            isReturned ||
                            isRefunded;


                        const timeline =
                            getTimeline(
                                status
                            );


                        return (

                            <div
                                key={
                                    order.id
                                }
                                className={`
                                    order-card
                                    ${
                                        isCancelled
                                            ? "order-cancelled"
                                            : ""
                                    }
                                    ${
                                        isFailed
                                            ? "order-failed"
                                            : ""
                                    }
                                    ${
                                        isReturned
                                            ? "order-returned"
                                            : ""
                                    }
                                    ${
                                        isRefunded
                                            ? "order-refunded"
                                            : ""
                                    }
                                `}
                            >


                                {/* =================================================
                                    HEADER
                                ================================================= */}

                                <div className="order-top">

                                    <div>

                                        <h3>
                                            Order #
                                            {order.id}
                                        </h3>


                                        <p>

                                            {order.created_at
                                                ? new Date(
                                                      order.created_at
                                                  ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                          day:
                                                              "2-digit",

                                                          month:
                                                              "short",

                                                          year:
                                                              "numeric",
                                                      }
                                                  )
                                                : "Date unavailable"}

                                        </p>

                                    </div>


                                    <span
                                        className={`
                                            status
                                            status-${status.replace(
                                                /\s+/g,
                                                "-"
                                            )}
                                        `}
                                    >
                                        {statusLabel}
                                    </span>

                                </div>


                                {/* =================================================
                                    PRODUCTS
                                ================================================= */}

                                <div className="order-items">

                                    {items.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const itemName =
                                                getItemName(
                                                    item
                                                );


                                            const itemImage =
                                                getItemImage(
                                                    item
                                                );


                                            const itemQuantity =
                                                getItemQuantity(
                                                    item
                                                );


                                            const itemSubtotal =
                                                getItemSubtotal(
                                                    item
                                                );


                                            return (

                                                <div
                                                    className="order-item"
                                                    key={
                                                        item.id ??
                                                        item.product ??
                                                        index
                                                    }
                                                >

                                                    {/* IMAGE */}

                                                    <div className="product-image">

                                                        {itemImage ? (

                                                            <img
                                                                src={
                                                                    itemImage
                                                                }
                                                                alt={
                                                                    itemName
                                                                }
                                                                loading="lazy"
                                                                onError={(
                                                                    event
                                                                ) => {

                                                                    console.error(
                                                                        "IMAGE LOAD FAILED:",
                                                                        itemImage
                                                                    );


                                                                    event.currentTarget.style.display =
                                                                        "none";


                                                                    const parent =
                                                                        event
                                                                            .currentTarget
                                                                            .parentElement;


                                                                    if (
                                                                        parent
                                                                    ) {

                                                                        parent.classList.add(
                                                                            "image-error"
                                                                        );
                                                                    }
                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="image-error-placeholder">

                                                                <span>
                                                                    No Image
                                                                </span>

                                                            </div>

                                                        )}

                                                    </div>


                                                    {/* PRODUCT INFO */}

                                                    <div className="product-info">

                                                        <h2>
                                                            {
                                                                itemName
                                                            }
                                                        </h2>


                                                        <p>
                                                            Quantity:

                                                            <b>
                                                                {" "}
                                                                {
                                                                    itemQuantity
                                                                }
                                                            </b>
                                                        </p>


                                                        {item?.product_price && (

                                                            <p>

                                                                Price:

                                                                <b>
                                                                    {" "}
                                                                    ₹
                                                                    {Number(
                                                                        item.product_price
                                                                    ).toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits:
                                                                                2,

                                                                            maximumFractionDigits:
                                                                                2,
                                                                        }
                                                                    )}
                                                                </b>

                                                            </p>

                                                        )}

                                                    </div>


                                                    {/* PRICE */}

                                                    <div className="order-price">

                                                        <h2>
                                                            ₹
                                                            {
                                                                itemSubtotal.toLocaleString(
                                                                    "en-IN",
                                                                    {
                                                                        minimumFractionDigits:
                                                                            2,

                                                                        maximumFractionDigits:
                                                                            2,
                                                                    }
                                                                )
                                                            }
                                                        </h2>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                {/* =================================================
                                    ADDRESS
                                ================================================= */}

                                <div className="order-address">

                                    <span>
                                        Delivery Address
                                    </span>


                                    <strong>
                                        {address}
                                    </strong>

                                </div>


                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                <div className="order-footer">


                                    {/* TOTAL */}

                                    <div className="order-total">

                                        <span>
                                            Total Amount
                                        </span>


                                        <strong>
                                            ₹
                                            {totalPrice.toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits:
                                                        2,

                                                    maximumFractionDigits:
                                                        2,
                                                }
                                            )}
                                        </strong>

                                    </div>


                                    {/* =================================================
                                        TIMELINE / SPECIAL STATUS
                                    ================================================= */}

                                    {!isSpecialStatus ? (

                                        <div className="timeline">

                                            {timeline.map(
                                                (
                                                    step,
                                                    index
                                                ) => (

                                                    <div
                                                        key={
                                                            step.key
                                                        }
                                                        className={`
                                                            timeline-step
                                                            ${
                                                                step.completed
                                                                    ? "completed"
                                                                    : ""
                                                            }
                                                            ${
                                                                step.current
                                                                    ? "current"
                                                                    : ""
                                                            }
                                                        `}
                                                    >

                                                        <span className="timeline-dot">

                                                            {step.completed
                                                                ? "✓"
                                                                : index + 1}

                                                        </span>


                                                        <strong>
                                                            {
                                                                step.label
                                                            }
                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    ) : (

                                        <div
                                            className={`
                                                special-order-status
                                                ${
                                                    isCancelled
                                                        ? "cancelled"
                                                        : ""
                                                }
                                                ${
                                                    isFailed
                                                        ? "failed"
                                                        : ""
                                                }
                                                ${
                                                    isReturned
                                                        ? "returned"
                                                        : ""
                                                }
                                                ${
                                                    isRefunded
                                                        ? "refunded"
                                                        : ""
                                                }
                                            `}
                                        >

                                            <span>

                                                {isCancelled
                                                    ? "✕"
                                                    : isFailed
                                                        ? "!"
                                                        : isReturned
                                                            ? "↩"
                                                            : "✓"}

                                            </span>


                                            <strong>

                                                {isCancelled
                                                    ? "Order Cancelled"
                                                    : isFailed
                                                        ? "Payment Failed"
                                                        : isReturned
                                                            ? "Order Returned"
                                                            : "Payment Refunded"}

                                            </strong>

                                        </div>

                                    )}


                                    {/* =================================================
                                        VIEW DETAILS
                                    ================================================= */}

                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="view-order-btn"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}


export default MyOrders;