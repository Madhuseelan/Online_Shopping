import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "accounts/register/",
        {
          username: username.trim(),
          email: email.trim(),
          password: password,
        }
      );

      console.log("Registration response:", response.data);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to Login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data) {
        const data = error.response.data;

        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError(
            "Registration failed. Please check your details."
          );
        }
      } else {
        setError(
          "Unable to connect to Django server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* ================= LEFT BANNER ================= */}

        <div className="register-banner">

          {/* BRAND */}

          <Link
            to="/"
            className="register-brand"
          >

            <span className="register-logo">
              <i className="bi bi-bag-heart-fill"></i>
            </span>

            <span>Snap Shop</span>

          </Link>


          {/* BANNER CONTENT */}

          <div className="register-banner-content">

            <span className="register-banner-label">
              JOIN SNAP SHOP
            </span>

            <h1>

              Start your shopping
              <br />

              <strong>
                journey with us.
              </strong>

            </h1>

            <p>
              Create your Snap Shop account
              and enjoy amazing products,
              exclusive offers and a smarter
              shopping experience.
            </p>

          </div>


          {/* BANNER FOOTER */}

          <div className="register-banner-footer">

            <span>
              <i className="bi bi-check-circle-fill"></i>
              Secure shopping
            </span>

            <span>
              <i className="bi bi-check-circle-fill"></i>
              Track your orders
            </span>

            <span>
              <i className="bi bi-check-circle-fill"></i>
              Exclusive offers
            </span>

          </div>

        </div>


        {/* ================= RIGHT FORM ================= */}

        <div className="register-form-container">

          {/* HEADER */}

          <div className="register-form-header">

            <h2>
              Create Account
            </h2>

            <p>
              Register for your Snap Shop account.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="register-error">

              <i className="bi bi-exclamation-circle"></i>

              <span>
                {error}
              </span>

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="register-success">

              <i className="bi bi-check-circle"></i>

              <span>
                {success}
              </span>

            </div>

          )}


          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* USERNAME */}

            <div className="register-field">

              <label htmlFor="register-username">
                Username
              </label>

              <div className="register-input-wrapper">

                <i className="bi bi-person"></i>

                <input
                  id="register-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <i className="bi bi-envelope"></i>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <i className="bi bi-lock"></i>

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  <i
                    className={
                      showPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>

                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <i className="bi bi-lock-fill"></i>

                <input
                  id="register-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  <i
                    className={
                      showConfirmPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>

                </button>

              </div>

            </div>


            {/* CREATE ACCOUNT BUTTON */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span>
                    Creating Account...
                  </span>

                  <i className="bi bi-arrow-repeat"></i>
                </>

              ) : (

                <>
                  <span>
                    Create Account
                  </span>

                  <i className="bi bi-arrow-right"></i>
                </>

              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="login-section">

            <p>
              Already have an account?
            </p>

            <Link
              to="/login"
              className="login-link"
            >

              Login

              <i className="bi bi-arrow-right"></i>

            </Link>

          </div>


          {/* BACK */}

          <Link
            to="/"
            className="back-shopping"
          >

            <i className="bi bi-arrow-left"></i>

            Back to Shopping

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;