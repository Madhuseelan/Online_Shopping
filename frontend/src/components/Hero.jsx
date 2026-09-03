import heroImage from "../assets/images/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${heroImage})`
      }}
    >
      <div className="hero-content">

        <span className="hero-badge">
          ✨ New Arrival
        </span>

        <h1>
          Smart Living
          <br />
          Starts with
          <br />
          <span>Innovation</span>
        </h1>

        <p>
          Discover cutting-edge products designed to
          elevate your lifestyle and make everyday
          living smarter.
        </p>

        <div className="hero-buttons">

          <button className="shop-btn">
            🛍 Shop Now
          </button>

          <button className="explore-btn">
            ▶ Explore Collections
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;