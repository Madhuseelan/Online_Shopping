import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">
              🛍️
            </span>

            <span>Snap Shop</span>
          </Link>

          <p className="footer-description">
            Discover smart products, modern electronics and
            everyday essentials at Snap Shop.
          </p>

          {/* SOCIAL */}
          <div className="footer-social">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>

          </div>

        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/contact">
            Contact
          </Link>

        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-column">

          <h3>Customer Care</h3>

          <Link to="/cart">
            My Cart
          </Link>

          <Link to="/checkout">
            Checkout
          </Link>

          <a href="#shipping">
            Shipping
          </a>

          <a href="#returns">
            Returns
          </a>

        </div>

        {/* CONTACT */}
        <div className="footer-column">

          <h3>Contact Us</h3>

          <div className="footer-contact">
            <span className="contact-icon">✉</span>
            <span>support@snapshop.com</span>
          </div>

          <div className="footer-contact">
            <span className="contact-icon">☎</span>
            <span>+91 98765 43210</span>
          </div>

          <div className="footer-contact">
            <span className="contact-icon">📍</span>
            <span>Bengaluru, India</span>
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom-container">

        <div className="footer-bottom">

          <p>
            © 2026 <strong>Snap Shop</strong>.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <a href="#privacy">
              Privacy Policy
            </a>

            <span>|</span>

            <a href="#terms">
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;