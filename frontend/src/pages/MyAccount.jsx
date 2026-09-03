import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import "./MyAccount.css";


function MyAccount() {

    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD CURRENT CUSTOMER
    // =====================================================

    useEffect(() => {

        let isMounted = true;

        const loadCustomer = async () => {

            try {
                setLoading(true);
                setError("");


                // =================================================
                // CHECK LOGIN
                // =================================================

                const token =
                    localStorage.getItem("accessToken");

                if (!token) {
                    navigate("/login");
                    return;
                }


                // =================================================
                // GET CURRENT CUSTOMER
                // =================================================
                // Correct Django URL:
                // /api/accounts/profile/
                // =================================================

                const response = await api.get(
                    "accounts/profile/"
                );


                if (!isMounted) {
                    return;
                }


                // =================================================
                // SAVE CUSTOMER
                // =================================================

                setCustomer(response.data);

                localStorage.setItem(
                    "customer",
                    JSON.stringify(response.data)
                );


            } catch (err) {

                if (!isMounted) {
                    return;
                }


                // =================================================
                // UNAUTHORIZED
                // =================================================

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


                // =================================================
                // OTHER ERROR
                // =================================================

                setError(
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load account information."
                );

            } finally {

                if (isMounted) {
                    setLoading(false);
                }

            }

        };


        loadCustomer();


        return () => {
            isMounted = false;
        };

    }, [navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section className="account-page">

                <div className="account-loading">

                    <div className="account-spinner"></div>

                    <p>
                        Loading your account...
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

            <section className="account-page">

                <div className="account-error">

                    <i className="bi bi-exclamation-circle"></i>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
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
    // NO CUSTOMER
    // =====================================================

    if (!customer) {
        return null;
    }


    // =====================================================
    // DISPLAY NAME
    // =====================================================

    const displayName =
        customer.first_name ||
        customer.username ||
        "Customer";


    // =====================================================
    // ACCOUNT PAGE
    // =====================================================

    return (

        <section className="account-page">

            <div className="account-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="account-header">

                    <div className="account-avatar">

                        {(
                            customer.first_name ||
                            customer.username ||
                            "U"
                        )
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div className="account-title">

                        <span>
                            MY ACCOUNT
                        </span>

                        <h1>
                            Welcome, {displayName}
                        </h1>

                        <p>
                            Manage your account information
                            and orders.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="account-card">

                    <div className="card-heading">

                        <div className="card-icon">
                            <i className="bi bi-person"></i>
                        </div>

                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Your account details
                            </p>

                        </div>

                    </div>


                    <div className="account-divider"></div>


                    <div className="account-grid">


                        {/* USERNAME */}

                        <div className="account-field">

                            <span>
                                Username
                            </span>

                            <strong>
                                {customer.username || "-"}
                            </strong>

                        </div>


                        {/* EMAIL */}

                        <div className="account-field">

                            <span>
                                Email
                            </span>

                            <strong>
                                {customer.email || "-"}
                            </strong>

                        </div>


                        {/* FIRST NAME */}

                        <div className="account-field">

                            <span>
                                First Name
                            </span>

                            <strong>
                                {customer.first_name || "-"}
                            </strong>

                        </div>


                        {/* LAST NAME */}

                        <div className="account-field">

                            <span>
                                Last Name
                            </span>

                            <strong>
                                {customer.last_name || "-"}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    ACCOUNT STATUS
                ================================================= */}

                <div className="account-card status-card">

                    <div className="card-heading">

                        <div className="card-icon">
                            <i className="bi bi-shield-check"></i>
                        </div>

                        <div>

                            <h2>
                                Account Status
                            </h2>

                            <p>
                                Current account status
                            </p>

                        </div>

                    </div>


                    <div className="account-divider"></div>


                    <div className="status-row">

                        <div>

                            <span>
                                Account
                            </span>

                            <strong>
                                Active
                            </strong>

                        </div>


                        <div className="active-status">

                            <span className="status-dot"></span>

                            Active

                        </div>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="account-actions">


                    {/* MY ORDERS */}

                    <Link
                        to="/my-orders"
                        className="account-action"
                    >

                        <i className="bi bi-box-seam"></i>

                        <div>

                            <strong>
                                My Orders
                            </strong>

                            <span>
                                View your orders
                            </span>

                        </div>

                        <i className="bi bi-chevron-right"></i>

                    </Link>


                    {/* PRODUCTS */}

                    <Link
                        to="/products"
                        className="account-action"
                    >

                        <i className="bi bi-cart3"></i>

                        <div>

                            <strong>
                                Continue Shopping
                            </strong>

                            <span>
                                Explore our products
                            </span>

                        </div>

                        <i className="bi bi-chevron-right"></i>

                    </Link>


                </div>


            </div>

        </section>

    );
}


export default MyAccount;