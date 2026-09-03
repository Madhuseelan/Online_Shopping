import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import "./Navbar.css";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const { cartCount } = useCart();


    // =====================================================
    // STATES
    // =====================================================

    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [customerMenu, setCustomerMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    // =====================================================
    // CUSTOMER
    // =====================================================

    const [customer, setCustomer] = useState(() => {

        const savedCustomer =
            localStorage.getItem("customer");

        if (!savedCustomer) {
            return null;
        }

        try {

            return JSON.parse(savedCustomer);

        } catch (error) {

            console.error(
                "Customer data error:",
                error
            );

            return null;
        }

    });


    // =====================================================
    // SCROLL ANIMATION
    // =====================================================

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(window.scrollY > 20);

        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        handleScroll();

        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    // =====================================================
    // CHECK CUSTOMER
    // =====================================================

    useEffect(() => {

        const checkCustomer = () => {

            const savedCustomer =
                localStorage.getItem("customer");

            if (!savedCustomer) {

                setCustomer(null);

                return;

            }

            try {

                const customerData =
                    JSON.parse(savedCustomer);

                setCustomer(customerData);

            } catch (error) {

                console.error(error);

                localStorage.removeItem(
                    "customer"
                );

                setCustomer(null);

            }

        };


        checkCustomer();


        window.addEventListener(
            "storage",
            checkCustomer
        );


        return () => {

            window.removeEventListener(
                "storage",
                checkCustomer
            );

        };

    }, []);


    // =====================================================
    // CLOSE MENUS
    // =====================================================

    const closeMenus = () => {

        setMenuOpen(false);
        setCustomerMenu(false);

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (e) => {

        e.preventDefault();

        const value =
            search.trim();

        if (!value) {

            return;

        }

        navigate(
            `/products?search=${encodeURIComponent(value)}`
        );

        setSearch("");

        closeMenus();

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "customer"
        );

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "rememberMe"
        );

        setCustomer(null);

        setCustomerMenu(false);

        setMenuOpen(false);

        navigate("/login");

    };


    // =====================================================
    // CUSTOMER NAME
    // =====================================================

    const customerName =

        customer?.username ||

        customer?.email?.split("@")[0] ||

        "Customer";


    const customerInitial =

        customerName
            .charAt(0)
            .toUpperCase();


    // =====================================================
    // ACTIVE PAGE
    // =====================================================

    const isActive = (path) => {

        if (path === "/") {

            return location.pathname === "/";

        }

        return location.pathname.startsWith(path);

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <>

            {/* =================================================
                NAVBAR
            ================================================= */}

            <header
                className={`snap-navbar ${
                    scrolled
                        ? "navbar-scrolled"
                        : ""
                }`}
            >

                <div className="navbar-container">


                    {/* =========================================
                        LOGO
                    ========================================= */}

                    <Link
                        to="/"
                        className="snap-logo"
                        onClick={closeMenus}
                    >

                        <span className="logo-icon">

                            <i className="bi bi-bag-heart-fill"></i>

                        </span>

                        <span className="logo-text">
                            Snap<span>Shop</span>
                        </span>

                    </Link>


                    {/* =========================================
                        DESKTOP NAVIGATION
                    ========================================= */}

                    <nav className="desktop-navigation">

                        <Link
                            to="/"
                            className={
                                `nav-link ${
                                    isActive("/")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            Home
                        </Link>


                        <Link
                            to="/products"
                            className={
                                `nav-link ${
                                    isActive("/products")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            Products
                        </Link>


                        <Link
                            to="/about"
                            className={
                                `nav-link ${
                                    isActive("/about")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            About
                        </Link>


                        <Link
                            to="/contact"
                            className={
                                `nav-link ${
                                    isActive("/contact")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            Contact
                        </Link>

                    </nav>


                    {/* =========================================
                        RIGHT ACTIONS
                    ========================================= */}

                    <div className="navbar-actions">


                        {/* SEARCH */}

                        <form
                            className="search-container"
                            onSubmit={handleSearch}
                        >

                            <i className="bi bi-search search-icon"></i>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search products..."
                            />

                            {search && (

                                <button
                                    type="button"
                                    className="search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >

                                    <i className="bi bi-x"></i>

                                </button>

                            )}

                        </form>


                        {/* CART */}

                        <Link
                            to="/cart"
                            className="cart-button"
                            onClick={closeMenus}
                            aria-label="Shopping cart"
                        >

                            <i className="bi bi-cart3"></i>

                            {cartCount > 0 && (

                                <span className="cart-badge">

                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount
                                    }

                                </span>

                            )}

                        </Link>


                        {/* =====================================
                            CUSTOMER
                        ===================================== */}

                        {customer ? (

                            <div className="customer-wrapper">


                                <button
                                    type="button"
                                    className={
                                        `customer-button ${
                                            customerMenu
                                                ? "customer-open"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setCustomerMenu(
                                            !customerMenu
                                        )
                                    }
                                >

                                    <span className="customer-avatar">

                                        {customerInitial}

                                    </span>


                                    <span className="customer-name">

                                        {customerName}

                                    </span>


                                    <i
                                        className={
                                            `bi ${
                                                customerMenu
                                                    ? "bi-chevron-up"
                                                    : "bi-chevron-down"
                                            }`
                                        }
                                    ></i>

                                </button>


                                {/* DROPDOWN */}

                                {customerMenu && (

                                    <div className="customer-dropdown">


                                        {/* PROFILE */}

                                        <div className="dropdown-profile">

                                            <div className="dropdown-avatar">

                                                {customerInitial}

                                            </div>


                                            <div className="dropdown-user-info">

                                                <strong>
                                                    {customerName}
                                                </strong>

                                                <span>
                                                    {customer?.email ||
                                                        "Customer"}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="dropdown-divider"></div>


                                        {/* MY ACCOUNT */}

                                        <Link
                                            to="/my-account"
                                            className="dropdown-item"
                                            onClick={closeMenus}
                                        >

                                            <span className="dropdown-icon">
                                                <i className="bi bi-person"></i>
                                            </span>

                                            <span>
                                                <strong>
                                                    My Account
                                                </strong>

                                                <small>
                                                    Manage your profile
                                                </small>
                                            </span>

                                            <i className="bi bi-chevron-right dropdown-arrow"></i>

                                        </Link>


                                        {/* MY ORDERS */}

                                        <Link
                                            to="/my-orders"
                                            className="dropdown-item"
                                            onClick={closeMenus}
                                        >

                                            <span className="dropdown-icon">
                                                <i className="bi bi-box-seam"></i>
                                            </span>

                                            <span>
                                                <strong>
                                                    My Orders
                                                </strong>

                                                <small>
                                                    Track your orders
                                                </small>
                                            </span>

                                            <i className="bi bi-chevron-right dropdown-arrow"></i>

                                        </Link>


                                        {/* CART */}

                                        <Link
                                            to="/cart"
                                            className="dropdown-item"
                                            onClick={closeMenus}
                                        >

                                            <span className="dropdown-icon">
                                                <i className="bi bi-cart3"></i>
                                            </span>

                                            <span>
                                                <strong>
                                                    My Cart
                                                </strong>

                                                <small>
                                                    {cartCount} item
                                                    {cartCount !== 1
                                                        ? "s"
                                                        : ""
                                                    }
                                                </small>
                                            </span>

                                            <i className="bi bi-chevron-right dropdown-arrow"></i>

                                        </Link>


                                        <div className="dropdown-divider"></div>


                                        {/* LOGOUT */}

                                        <button
                                            type="button"
                                            className="dropdown-logout"
                                            onClick={handleLogout}
                                        >

                                            <span className="logout-icon">

                                                <i className="bi bi-box-arrow-right"></i>

                                            </span>

                                            Logout

                                        </button>


                                    </div>

                                )}

                            </div>

                        ) : (

                            /* LOGIN */

                            <Link
                                to="/login"
                                className="login-button"
                                onClick={closeMenus}
                            >

                                <i className="bi bi-person"></i>

                                <span>
                                    Login
                                </span>

                            </Link>

                        )}


                        {/* =====================================
                            MOBILE BUTTON
                        ===================================== */}

                        <button
                            type="button"
                            className={
                                `mobile-menu-button ${
                                    menuOpen
                                        ? "menu-open"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                setMenuOpen(
                                    !menuOpen
                                )
                            }
                            aria-label="Toggle menu"
                        >

                            <span></span>
                            <span></span>
                            <span></span>

                        </button>

                    </div>

                </div>


                {/* =================================================
                    MOBILE NAVIGATION
                ================================================= */}

                <div
                    className={
                        `mobile-navigation ${
                            menuOpen
                                ? "mobile-navigation-open"
                                : ""
                        }`
                    }
                >

                    <div className="mobile-menu-inner">


                        <Link
                            to="/"
                            className={
                                `mobile-nav-link ${
                                    isActive("/")
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={closeMenus}
                        >

                            <i className="bi bi-house"></i>

                            Home

                        </Link>


                        <Link
                            to="/products"
                            className={
                                `mobile-nav-link ${
                                    isActive("/products")
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={closeMenus}
                        >

                            <i className="bi bi-grid"></i>

                            Products

                        </Link>


                        <Link
                            to="/about"
                            className="mobile-nav-link"
                            onClick={closeMenus}
                        >

                            <i className="bi bi-info-circle"></i>

                            About

                        </Link>


                        <Link
                            to="/contact"
                            className="mobile-nav-link"
                            onClick={closeMenus}
                        >

                            <i className="bi bi-envelope"></i>

                            Contact

                        </Link>


                        {customer && (

                            <>

                                <div className="mobile-divider"></div>


                                <Link
                                    to="/my-account"
                                    className="mobile-nav-link"
                                    onClick={closeMenus}
                                >

                                    <i className="bi bi-person"></i>

                                    My Account

                                </Link>


                                <Link
                                    to="/my-orders"
                                    className="mobile-nav-link"
                                    onClick={closeMenus}
                                >

                                    <i className="bi bi-box-seam"></i>

                                    My Orders

                                </Link>


                                <button
                                    type="button"
                                    className="mobile-logout"
                                    onClick={handleLogout}
                                >

                                    <i className="bi bi-box-arrow-right"></i>

                                    Logout

                                </button>

                            </>

                        )}

                    </div>

                </div>

            </header>

        </>

    );

}


export default Navbar;