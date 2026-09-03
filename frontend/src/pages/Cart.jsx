import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";


function Cart(){


    const navigate = useNavigate();


    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartTotal,
        loading
    } = useCart();




    if(loading){

        return <h2>Loading Cart...</h2>;

    }





    if(cartItems.length === 0){

        return (

            <div className="empty-cart">

                <h2>Your cart is empty</h2>

                <button
                    onClick={()=>navigate("/products")}
                >
                    Continue Shopping
                </button>

            </div>

        );

    }





    return (

        <section className="cart-page">


            <h1>
                Shopping Cart
            </h1>


            <p>
                Review your selected products
            </p>





            <div className="cart-container">



                <div className="cart-items">


                {

                    cartItems.map(item=>(


                        <div 
                        className="cart-card"
                        key={item.id}
                        >



                            <img

                                src={
                                    item.product_image
                                }

                                alt={
                                    item.product_name
                                }

                            />



                            <div className="cart-info">


                                <h2>
                                    {item.product_name}
                                </h2>



                                <h3>
                                    ₹{item.product_price}
                                </h3>



                                <div className="quantity-box">


                                    <button

                                    onClick={()=>
                                        decreaseQuantity(item)
                                    }

                                    >
                                        -
                                    </button>



                                    <span>
                                        {item.quantity}
                                    </span>



                                    <button

                                    onClick={()=>
                                        increaseQuantity(item)
                                    }

                                    >
                                        +
                                    </button>


                                </div>


                            </div>





                            <button

                            className="delete-btn"

                            onClick={()=>
                                removeFromCart(item.id)
                            }

                            >

                                🗑

                            </button>



                        </div>


                    ))

                }


                </div>







                <div className="summary">


                    <h2>
                        Order Summary
                    </h2>


                    <div className="total">


                        <span>
                            Total
                        </span>


                        <strong>
                            ₹{cartTotal}
                        </strong>


                    </div>




                    <button

                    onClick={()=>
                        navigate("/checkout")
                    }

                    >

                        Proceed Checkout

                    </button>



                </div>



            </div>


        </section>

    );


}


export default Cart;