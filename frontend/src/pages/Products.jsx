import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productApi";
import "./Products.css";


const DJANGO_URL = "http://127.0.0.1:8000";


function Products() {


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");





    // =========================================
    // LOAD PRODUCTS
    // =========================================

    useEffect(() => {


        const fetchProducts = async()=>{


            try {


                const data = await getProducts();


                console.log(
                    "PRODUCT DATA:",
                    data
                );


                if(Array.isArray(data)){

                    setProducts(data);

                }

                else if(data.results){

                    setProducts(data.results);

                }


            }
            catch(err){


                console.error(
                    "PRODUCT ERROR:",
                    err
                );


                setError(
                    "Product loading failed"
                );


            }
            finally{

                setLoading(false);

            }


        };



        fetchProducts();


    }, []);






    // =========================================
    // IMAGE URL
    // =========================================

    const getImageUrl = (image)=>{


        if(!image){

            return "/images/product-placeholder.jpg";

        }



        if(image.startsWith("http")){

            return image;

        }



        return DJANGO_URL + image;


    };







    // =========================================
    // CATEGORY
    // =========================================


    const categories = [

        "All",

        ...new Set(
            products.map(
                product=>product.category
            )
        )

    ];







    // =========================================
    // SEARCH FILTER
    // =========================================


    const filteredProducts = products.filter(product=>{


        const searchMatch =

            product.name
            .toLowerCase()
            .includes(
                search.toLowerCase()
            );



        const categoryMatch =

            category === "All"

            ||

            product.category === category;



        return (
            searchMatch &&
            categoryMatch
        );


    });







    if(loading){

        return (

            <h2>
                Loading Products...
            </h2>

        );

    }





    if(error){

        return (

            <h2>
                {error}
            </h2>

        );

    }







    return (

        <section className="products-page">


            <div className="container">



                <div className="products-heading">


                    <span>
                        OUR COLLECTION
                    </span>


                    <h1>
                        Explore Our Products
                    </h1>


                    <p>
                        Discover the latest smart gadgets and lifestyle products.
                    </p>


                </div>







                <div className="product-search-box">


                    <input

                        type="text"

                        placeholder="Search products..."

                        value={search}

                        onChange={
                            e=>setSearch(e.target.value)
                        }

                    />


                </div>







                <div className="category-filter">


                    {
                        categories.map(item=>(


                            <button


                                key={item}


                                className={

                                    category===item

                                    ?

                                    "filter-btn active"

                                    :

                                    "filter-btn"

                                }


                                onClick={
                                    ()=>setCategory(item)
                                }


                            >


                                {item}


                            </button>


                        ))
                    }


                </div>








                <div className="products-grid">


                    {

                        filteredProducts.map(product=>(


                            <ProductCard


                                key={product.id}


                                product={{

                                    ...product,

                                    image:
                                    getImageUrl(
                                        product.image
                                    )

                                }}


                            />


                        ))

                    }



                </div>



            </div>



        </section>

    );


}


export default Products;