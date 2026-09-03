import { Link } from "react-router-dom";
import "./Category.css";

function Category() {
  const categories = [
    {
      id: 1,
      icon: "⌚",
      title: "Smart Gadgets",
      description: "Smart devices for everyday life",
      products: "1 Product",
    },
    {
      id: 2,
      icon: "🎧",
      title: "Electronics",
      description: "Latest electronic products",
      products: "1 Product",
    },
    {
      id: 3,
      icon: "📱",
      title: "Mobiles",
      description: "Powerful smartphones",
      products: "1 Product",
    },
    {
      id: 4,
      icon: "📷",
      title: "Cameras",
      description: "Capture every special moment",
      products: "1 Product",
    },
    {
      id: 5,
      icon: "🎵",
      title: "Audio",
      description: "Premium sound and music",
      products: "1 Product",
    },
    {
      id: 6,
      icon: "💻",
      title: "Computers",
      description: "Laptops and computing devices",
      products: "1 Product",
    },
    {
      id: 7,
      icon: "❄️",
      title: "Home Appliances",
      description: "Smart solutions for your home",
      products: "2 Products",
    },
    {
      id: 8,
      icon: "🔊",
      title: "Smart Home",
      description: "Make your home smarter",
      products: "1 Product",
    },
    {
      id: 9,
      icon: "⌚",
      title: "Wearables",
      description: "Track your fitness every day",
      products: "1 Product",
    },
  ];

  return (
    <section
      id="categories"
      className="category-section"
    >
      <div className="container">

        {/* Heading */}

        <div className="category-heading">

          <span className="category-label">
            SHOP BY CATEGORY
          </span>

          <h2>
            Explore Our <span>Categories</span>
          </h2>

          <p>
            Find the perfect products for your
            lifestyle and everyday needs.
          </p>

        </div>


        {/* Categories */}

        <div className="category-grid">

          {categories.map((category) => (

            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(
                category.title
              )}`}
              className="category-card"
            >

              <div className="category-card-top">

                <div className="category-icon">
                  {category.icon}
                </div>

                <span className="category-arrow">
                  →
                </span>

              </div>


              <div className="category-content">

                <h3>
                  {category.title}
                </h3>

                <p>
                  {category.description}
                </p>

                <div className="category-bottom">

                  <span>
                    {category.products}
                  </span>

                  <span className="explore-text">
                    Explore →
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Category;