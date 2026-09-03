import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    const savedCustomer =
      localStorage.getItem("customer");

    if (!savedCustomer) {
      setError(
        "Account not found. Please register first."
      );
      return;
    }

    try {
      const customer = JSON.parse(savedCustomer);

      if (
        customer.email?.trim().toLowerCase() !==
        email.trim().toLowerCase()
      ) {
        setError(
          "No account found with this email address."
        );
        return;
      }

      const updatedCustomer = {
        ...customer,
        password: newPassword,
      };

      localStorage.setItem(
        "customer",
        JSON.stringify(updatedCustomer)
      );

      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-container">

        {/* =================================
            LEFT BANNER
        ================================= */}

        <div className="forgot-banner">

          <Link
            to="/"
            className="forgot-brand"
          >

            <span>
              <i className="bi bi-bag-heart-fill"></i>
            </span>

            <strong>
              Snap Shop
            </strong>

          </Link>


          <div className="forgot-banner-content">

            <div className="forgot-large-icon">
              <i className="bi bi-shield-lock-fill"></i>
            </div>

            <span>
              ACCOUNT SECURITY
            </span>

            <h1>
              Secure your
              <br />
              <strong>account again.</strong>
            </h1>

            <p>
              Create a new password and get back
              to shopping with Snap Shop.
              Your account security matters to us.
            </p>

          </div>


          <div className="forgot-benefits">

            <div>
              <i className="bi bi-check-circle-fill"></i>

              <span>
                Secure account recovery
              </span>
            </div>

            <div>
              <i className="bi bi-check-circle-fill"></i>

              <span>
                Protect your personal details
              </span>
            </div>

            <div>
              <i className="bi bi-check-circle-fill"></i>

              <span>
                Get back to shopping quickly
              </span>
            </div>

          </div>

        </div>


        {/* =================================
            RIGHT FORM
        ================================= */}

        <div className="forgot-form-container">

          <div className="forgot-form-header">

            <div className="forgot-icon">
              <i className="bi bi-key-fill"></i>
            </div>

            <h2>
              Reset Password
            </h2>

            <p>
              Enter your registered email and
              create a new password for your
              Snap Shop account.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="forgot-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="forgot-success">
              {success}
            </div>
          )}


          <form
            className="forgot-form"
            onSubmit={handleResetPassword}
          >

            {/* EMAIL */}

            <div className="forgot-field">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <div className="forgot-input">

                <i className="bi bi-envelope"></i>

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* NEW PASSWORD */}

            <div className="forgot-field">

              <label htmlFor="forgot-password">
                New Password
              </label>

              <div className="forgot-input">

                <i className="bi bi-lock"></i>

                <input
                  id="forgot-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(
                      e.target.value
                    );
                    setError("");
                    setSuccess("");
                  }}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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


            {/* SUBMIT */}

            <button
              type="submit"
              className="forgot-submit"
            >

              <span>
                Reset Password
              </span>

              <i className="bi bi-arrow-right"></i>

            </button>

          </form>


          {/* LOGIN */}

          <div className="forgot-login">

            <p>
              Remember your password?
            </p>

            <Link to="/login">
              <i className="bi bi-box-arrow-in-right"></i>

              Back to Login
            </Link>

          </div>


          {/* SHOPPING */}

          <Link
            to="/"
            className="forgot-shopping"
          >

            <i className="bi bi-arrow-left"></i>

            Back to Shopping

          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;