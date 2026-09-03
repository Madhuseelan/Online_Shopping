import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard";

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log("Products from Django:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div className="container">

      <h1 className="text-center my-4">
        Our Products
      </h1>

      <div className="row">

        {products.map((product) => (
          <div
            className="col-md-4 col-lg-3 mb-4"
            key={product.id}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}

      </div>

    </div>
  );
}

export default ProductList;