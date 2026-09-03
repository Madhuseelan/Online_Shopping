import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProduct } from "../api/productApi";
import { useCart } from "../context/CartContext";

import "./ProductDetails.css";


function ProductDetails() {


    const { id } = useParams();

    const navigate = useNavigate();


    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    const { addToCart } = useCart();




    // =========================================
    // LOAD PRODUCT
    // =========================================

    useEffect(() => {


        const loadProduct = async () => {


            try {


                const data = await getProduct(id);


                setProduct(data);



            } catch (err) {


                console.error(
                    "PRODUCT DETAILS ERROR:",
                    err
                );


                setError(
                    "Unable to load product"
                );


            } finally {


                setLoading(false);


            }


        };


        loadProduct();


    }, [id]);





    if (loading) {

        return (
            <h2>
                Loading product...
            </h2>
        );

    }



    if (error) {

        return (
            <h2>
                {error}
            </h2>
        );

    }





    // =========================================
    // ADD CART
    // =========================================

    const handleAddCart = async () => {


        try {


            await addToCart(
                product,
                1
            );


            alert(
                "Product added to cart"
            );


        } catch(err){


            console.log(err);


        }


    };






    // =========================================
    // BUY NOW
    // =========================================

    const handleBuyNow = async () => {


        try {


            await addToCart(
                product,
                1
            );


            navigate(
                "/checkout"
            );



        } catch(err){


            console.log(err);


        }


    };





    return (


        <section className="product-details">



            <div className="product-details-image">


                <img

                    src={product.image}

                    alt={product.name}

                />


            </div>





            <div className="product-details-info">


                <h1>

                    {product.name}

                </h1>



                <h2>

                    ₹{product.price}

                </h2>




                <p>

                    {product.description}

                </p>




                <div className="product-actions">


                    <button

                        className="add-cart-btn"

                        onClick={handleAddCart}

                    >

                        🛒 Add To Cart

                    </button>





                    <button

                        className="buy-now-btn"

                        onClick={handleBuyNow}

                    >

                        ⚡ Buy Now

                    </button>



                </div>



            </div>



        </section>


    );

}


export default ProductDetails;