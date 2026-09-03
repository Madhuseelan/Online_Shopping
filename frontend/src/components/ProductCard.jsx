import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const toastTimer = useRef(null);
  const addedTimer = useRef(null);

  // Clean up any pending timers if the card unmounts
  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(addedTimer.current);
    };
  }, []);

  // =====================================================
  // DERIVED VALUES
  // =====================================================

  const inStock = product.stock === undefined || product.stock > 0;
  const lowStock =
    product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  const maxQty = product.stock > 0  ? Math.min(product.stock, 10) : 10;

  const hasDiscount =
    product.original_price && product.original_price > product.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  const rating = product.rating ? Number(product.rating) : null;

  // =====================================================
  // TOAST HELPER
  // =====================================================

  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // =====================================================
  // QUANTITY STEPPER
  // =====================================================

  const decrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => Math.max(1, q - 1));
  };

  const incrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => Math.min(maxQty, q + 1));
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      "info"
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock || adding) return;

    try {
      setAdding(true);

      await addToCart(product, qty);

      setAdded(true);
      showToast(`Added ${qty} to cart`, "success");

      clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setAdded(false), 1500);

      setQty(1);
    } catch (error) {
      showToast(error.message || "Could not add to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      {/* =================================================
          TOAST
      ================================================= */}
      {toast && (
        <div className={`card-toast card-toast--${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      {/* =================================================
          BADGES
      ================================================= */}
      <div className="badge-row">
        {hasDiscount && (
          <span className="product-badge product-badge--discount">
            {discountPct}% OFF
          </span>
        )}
        {!inStock && (
          <span className="product-badge product-badge--out">
            Out of Stock
          </span>
        )}
        {inStock && lowStock && (
          <span className="product-badge product-badge--low">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* =================================================
          WISHLIST
      ================================================= */}
      <button
        type="button"
        className={`wishlist-btn ${wishlisted ? "wishlist-btn--active" : ""}`}
        onClick={toggleWishlist}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? "♥" : "♡"}
      </button>

      {/* =================================================
          IMAGE / DETAILS LINK
      ================================================= */}
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>

        <h3>{product.name}</h3>

        {rating !== null && (
          <div className="rating-row">
            <span className="rating-stars" aria-hidden="true">
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </span>
            <span className="rating-value">{rating.toFixed(1)}</span>
            {product.rating_count !== undefined && (
              <span className="rating-count">({product.rating_count})</span>
            )}
          </div>
        )}

        <div className="price-row">
          <h2>₹{Number(product.price).toFixed(2)}</h2>
          {hasDiscount && (
            <span className="price-strike">
              ₹{Number(product.original_price).toFixed(2)}
            </span>
          )}
        </div>
      </Link>

      {/* =================================================
          CART ACTIONS
      ================================================= */}
      <div className="cart-actions">
        <div className="qty-stepper" aria-label="Select quantity">
          <button
          type="button"
          onClick={decrementQty}
          disabled={qty <= 1}
          >
            -
            </button>

          <span>{qty}</span>
          <button
            type="button"
            onClick={incrementQty}
            disabled={qty >= maxQty}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={`add-to-cart-btn ${added ? "add-to-cart-btn--added" : ""}`}
          onClick={handleCart}
          disabled={!inStock || adding}
        >
          {!inStock
            ? "Unavailable"
            : adding
            ? "Adding…"
            : added
            ? "✓ Added"
            : "🛒 Add To Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;