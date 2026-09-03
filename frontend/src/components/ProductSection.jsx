import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../api/productApi";
import "./ProductSection.css";

function ProductSection() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const trackRef = useRef(null);


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data = await getProducts();

                console.log("Products:", data);

                setProducts(data);

            } catch (err) {

                console.error(
                    "Product Error:",
                    err
                );

                setError(
                    "Unable to load products"
                );

            } finally {

                setLoading(false);

            }

        };

        loadProducts();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="product-loading">

                <span className="loading-spinner"></span>

                Loading products...

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="product-error">

                <i className="bi bi-exclamation-circle"></i>

                {error}

            </div>
        );

    }


    // ==========================================
    // EMPTY
    // ==========================================

    if (!products.length) {

        return (
            <div className="product-empty">

                <i className="bi bi-box-seam"></i>

                <p>
                    No products available.
                </p>

            </div>
        );

    }


    /*
        Duplicate products.

        This creates the continuous
        shopping-app scrolling effect.
    */

    const scrollingProducts = [
        ...products,
        ...products
    ];


    return (

        <section className="product-section">


            {/* ==================================
                CONTAINER
            ================================== */}

            <div className="product-container">


                {/* ==================================
                    SECTION HEADER
                ================================== */}

                <div className="product-heading">


                    <span className="product-label">

                        OUR PRODUCTS

                    </span>


                    <h2>

                        Explore Our Products

                    </h2>


                    <p>

                        Discover our latest products
                        and shop your favorites.

                    </p>


                </div>


                {/* ==================================
                    PRODUCT SLIDER
                ================================== */}

                <div
                    className="product-slider"
                    ref={trackRef}
                >


                    {/* LEFT FADE */}

                    <div className="slider-fade-left"></div>


                    {/* PRODUCT TRACK */}

                    <div className="product-track">


                        {scrollingProducts.map(
                            (product, index) => (

                                <div
                                    className="product-slide"
                                    key={`${product.id}-${index}`}
                                >

                                    <ProductCard
                                        product={product}
                                    />

                                </div>

                            )
                        )}


                    </div>


                    {/* RIGHT FADE */}

                    <div className="slider-fade-right"></div>


                </div>


            </div>


        </section>

    );

}


export default ProductSection;