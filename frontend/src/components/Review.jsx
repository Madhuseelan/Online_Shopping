import "./Review.css";

function Review() {
  const reviews = [
  {
    id: 1,
    name: "Arun Kumar",
    role: "Verified Customer",
    rating: 5,
    message:
      "Amazing shopping experience! The product quality was excellent and delivery was very fast.",
    initial: "A",
  },
  {
    id: 2,
    name: "Priya S",
    role: "Verified Customer",
    rating: 5,
    message:
      "I really liked the clean website design and the product arrived exactly as shown.",
    initial: "P",
  },
  {
    id: 3,
    name: "Rahul M",
    role: "Verified Customer",
    rating: 4,
    message:
      "Good products at reasonable prices. The checkout process was simple and convenient.",
    initial: "R",
  },
  {
    id: 4,
    name: "Divya R",
    role: "Verified Customer",
    rating: 5,
    message:
      "The smartwatch quality is excellent. It looks premium and works perfectly.",
    initial: "D",
  },
  {
    id: 5,
    name: "Karthik V",
    role: "Verified Customer",
    rating: 5,
    message:
      "Very happy with my wireless headphones. The sound quality is impressive.",
    initial: "K",
  },
  {
    id: 6,
    name: "Sneha P",
    role: "Verified Customer",
    rating: 4,
    message:
      "The ordering process was very easy and my product was delivered safely.",
    initial: "S",
  },
  {
    id: 7,
    name: "Vignesh R",
    role: "Verified Customer",
    rating: 5,
    message:
      "Excellent collection of products. I found exactly what I was looking for.",
    initial: "V",
  },
  {
    id: 8,
    name: "Keerthana M",
    role: "Verified Customer",
    rating: 5,
    message:
      "The 5G smartphone is great for the price. Very satisfied with my purchase.",
    initial: "K",
  },
  {
    id: 9,
    name: "Sanjay Kumar",
    role: "Verified Customer",
    rating: 4,
    message:
      "Nice website with a smooth shopping experience. Product quality is good.",
    initial: "S",
  },
  {
    id: 10,
    name: "Harini S",
    role: "Verified Customer",
    rating: 5,
    message:
      "Fast delivery and excellent packaging. I will definitely shop here again.",
    initial: "H",
  },
  {
    id: 11,
    name: "Mohan Raj",
    role: "Verified Customer",
    rating: 5,
    message:
      "The camera quality is fantastic. The product feels premium and reliable.",
    initial: "M",
  },
  {
    id: 12,
    name: "Nithya K",
    role: "Verified Customer",
    rating: 4,
    message:
      "The earbuds are comfortable and the audio quality is really good.",
    initial: "N",
  },
  {
    id: 13,
    name: "Ajay Kumar",
    role: "Verified Customer",
    rating: 5,
    message:
      "Excellent laptop with great performance. Perfect for my daily work.",
    initial: "A",
  },
  {
    id: 14,
    name: "Meena R",
    role: "Verified Customer",
    rating: 5,
    message:
      "The portable air cooler works very well and is easy to use.",
    initial: "M",
  },
  {
    id: 15,
    name: "Praveen S",
    role: "Verified Customer",
    rating: 4,
    message:
      "The smart speaker has clear sound and the design looks very stylish.",
    initial: "P",
  },
  {
    id: 16,
    name: "Anitha V",
    role: "Verified Customer",
    rating: 5,
    message:
      "Very useful water dispenser with a modern design. Happy with the purchase.",
    initial: "A",
  },
  {
    id: 17,
    name: "Dinesh B",
    role: "Verified Customer",
    rating: 5,
    message:
      "The fitness band is lightweight and comfortable for everyday workouts.",
    initial: "D",
  },
  {
    id: 18,
    name: "Lakshmi P",
    role: "Verified Customer",
    rating: 4,
    message:
      "Great products and reasonable prices. The website is easy to navigate.",
    initial: "L",
  },
  {
    id: 19,
    name: "Suresh K",
    role: "Verified Customer",
    rating: 5,
    message:
      "Customer service was helpful and my order arrived on time. Great experience.",
    initial: "S",
  },
  {
    id: 20,
    name: "Aishwarya R",
    role: "Verified Customer",
    rating: 5,
    message:
      "I loved the overall shopping experience. Good quality products and quick delivery.",
    initial: "A",
  },
];

  return (
    <section className="review-section">

      <div className="container">

        {/* Heading */}

        <div className="review-heading">

          <span>
            CUSTOMER REVIEWS
          </span>

          <h2>
            What Our <strong>Customers Say</strong>
          </h2>

          <p>
            Thousands of customers trust Snap Shop
            for their everyday shopping needs.
          </p>

        </div>


        {/* Reviews */}

        <div className="review-grid">

          {reviews.map((review) => (

            <div
              className="review-card"
              key={review.id}
            >

              <div className="review-top">

                <div className="review-user">

                  <div className="review-avatar">
                    {review.initial}
                  </div>

                  <div>
                    <h3>
                      {review.name}
                    </h3>

                    <span>
                      {review.role}
                    </span>
                  </div>

                </div>

                <div className="verified">
                  <i className="bi bi-patch-check-fill"></i>
                </div>

              </div>


              {/* Rating */}

              <div className="review-rating">

                {Array.from(
                  { length: 5 },
                  (_, index) => (
                    <i
                      key={index}
                      className={
                        index < review.rating
                          ? "bi bi-star-fill"
                          : "bi bi-star"
                      }
                    ></i>
                  )
                )}

              </div>


              {/* Message */}

              <p className="review-message">
                "{review.message}"
              </p>


              <div className="review-footer">

                <i className="bi bi-quote"></i>

                <span>
                  Verified Purchase
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Review;