import { useState } from "react";

import "./Newsletter.css";

function Newsletter() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    alert(
      "Thank you! You have successfully subscribed."
    );

    setEmail("");
  };

  return (
    <section className="newsletter-section">

      <div className="container">

        <div className="newsletter-box">

          {/* LEFT */}

          <div className="newsletter-content">

            <div className="newsletter-icon">
              <i className="bi bi-envelope-heart"></i>
            </div>

            <div>

              <span>
                STAY UPDATED
              </span>

              <h2>
                Subscribe to Our Newsletter
              </h2>

              <p>
                Get exclusive offers, new product
                updates and special deals directly
                in your inbox.
              </p>

            </div>

          </div>


          {/* FORM */}

          <form
            className="newsletter-form"
            onSubmit={handleSubmit}
          >

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button type="submit">
              Subscribe
              <i className="bi bi-arrow-right"></i>
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;