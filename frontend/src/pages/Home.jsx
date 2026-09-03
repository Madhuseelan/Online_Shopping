import Hero from "../components/Hero";
import Category from "../components/Category";
import ProductSection from "../components/ProductSection";
import Review from "../components/Review";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />

      <Category />

      {/* Products from Django REST API */}
      <ProductSection />

      <Review />

      <Newsletter />

      <Footer />
    </>
  );
}

export default Home;