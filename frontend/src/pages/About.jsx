import "./About.css";

function About() {
  return (
    <section className="about-page">

      <div className="container">

        <div className="about-hero">

          <span className="about-label">
            ABOUT SNAP SHOP
          </span>

          <h1>
            Smart Shopping.
            <br />
            <span>Better Living.</span>
          </h1>

          <p>
            Snap Shop is a modern online shopping platform
            designed to make discovering and buying smart
            products simple, fast, and enjoyable.
          </p>

        </div>


        <div className="about-grid">

          <div className="about-card">

            <div className="about-icon">
              <i className="bi bi-bullseye"></i>
            </div>

            <h2>
              Our Mission
            </h2>

            <p>
              Our mission is to provide quality products
              with a simple and enjoyable shopping
              experience.
            </p>

          </div>


          <div className="about-card">

            <div className="about-icon">
              <i className="bi bi-lightbulb"></i>
            </div>

            <h2>
              Innovation
            </h2>

            <p>
              We focus on modern technology and smart
              products that make everyday life easier.
            </p>

          </div>


          <div className="about-card">

            <div className="about-icon">
              <i className="bi bi-heart"></i>
            </div>

            <h2>
              Customer First
            </h2>

            <p>
              We believe in creating a smooth shopping
              experience that puts customers first.
            </p>

          </div>

        </div>


        <div className="about-stats">

          <div>
            <strong>10+</strong>
            <span>Products</span>
          </div>

          <div>
            <strong>9</strong>
            <span>Categories</span>
          </div>

          <div>
            <strong>4.8★</strong>
            <span>Average Rating</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Online Shopping</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;