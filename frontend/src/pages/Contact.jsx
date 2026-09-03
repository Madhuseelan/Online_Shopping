import { useState } from "react";

import "./Contact.css";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Thank you ${formData.name}! Your message has been sent.`
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-page">

      <div className="container">

        {/* HEADER */}

        <div className="contact-heading">

          <span>
            GET IN TOUCH
          </span>

          <h1>
            Contact <strong>Snap Shop</strong>
          </h1>

          <p>
            Have a question or need help?
            We'd love to hear from you.
          </p>

        </div>


        <div className="contact-layout">

          {/* CONTACT INFORMATION */}

          <div className="contact-info">

            <h2>
              Let's Talk
            </h2>

            <p>
              Our team is here to help you with
              your shopping experience.
            </p>


            <div className="contact-item">

              <div className="contact-icon">
                <i className="bi bi-envelope"></i>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  support@snapshop.com
                </strong>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                <i className="bi bi-telephone"></i>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  +91 98765 43210
                </strong>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                <i className="bi bi-geo-alt"></i>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  Bengaluru, India
                </strong>
              </div>

            </div>

          </div>


          {/* CONTACT FORM */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-grid">

              <div className="contact-field">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="contact-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="contact-field">

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                placeholder="What can we help you with?"
                value={formData.subject}
                onChange={handleChange}
                required
              />

            </div>


            <div className="contact-field">

              <label>
                Message
              </label>

              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="send-message-btn"
            >
              Send Message
              <i className="bi bi-send"></i>
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Contact;