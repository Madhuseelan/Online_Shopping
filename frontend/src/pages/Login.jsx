import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";

import "./Login.css";


function Login() {

    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        // =================================================
        // VALIDATION
        // =================================================

        if (!username.trim()) {

            setError(
                "Please enter your username."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        setLoading(true);


        try {

            // =================================================
            // LOGIN API
            // =================================================

            console.log(
                "LOGIN REQUEST:",
                {
                    username: username.trim()
                }
            );


            const response = await api.post(
                "accounts/login/",
                {
                    username: username.trim(),
                    password: password,
                }
            );


            console.log(
                "LOGIN SUCCESS:",
                response.data
            );


            const data = response.data;


            // =================================================
            // CHECK ACCESS TOKEN
            // =================================================

            if (!data?.access) {

                setError(
                    "Login failed. Access token not received."
                );

                return;
            }


            // =================================================
            // SAVE ACCESS TOKEN
            // =================================================

            localStorage.setItem(
                "accessToken",
                data.access
            );


            // =================================================
            // SAVE REFRESH TOKEN
            // =================================================

            if (data.refresh) {

                localStorage.setItem(
                    "refreshToken",
                    data.refresh
                );

            }


            // =================================================
            // SAVE CUSTOMER
            // =================================================

            if (data.user) {

                localStorage.setItem(
                    "customer",
                    JSON.stringify(data.user)
                );

            }


            // =================================================
            // REMEMBER ME
            // =================================================

            if (rememberMe) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "rememberMe"
                );

            }


            // =================================================
            // VERIFY TOKEN
            // =================================================

            console.log(
                "ACCESS TOKEN SAVED:",
                localStorage.getItem(
                    "accessToken"
                )
            );


            // =================================================
            // LOGIN COMPLETE
            // =================================================

            setError("");

            navigate("/");

        }

        // =====================================================
        // ERROR
        // =====================================================

        catch (err) {

            console.error(
                "LOGIN ERROR:",
                err
            );


            console.error(
                "STATUS:",
                err.response?.status
            );


            console.error(
                "DJANGO RESPONSE:",
                err.response?.data
            );


            console.error(
                "REQUEST URL:",
                err.config?.url
            );


            // =================================================
            // DJANGO RESPONSE ERROR
            // =================================================

            if (err.response) {

                const responseStatus =
                    err.response.status;

                const responseData =
                    err.response.data;


                // =============================================
                // 401
                // =============================================

                if (responseStatus === 401) {

                    setError(
                        responseData?.detail ||
                        "Invalid username or password."
                    );

                }


                // =============================================
                // 400
                // =============================================

                else if (responseStatus === 400) {

                    if (responseData?.username) {

                        setError(
                            Array.isArray(
                                responseData.username
                            )
                                ? responseData.username[0]
                                : responseData.username
                        );

                    }

                    else if (responseData?.password) {

                        setError(
                            Array.isArray(
                                responseData.password
                            )
                                ? responseData.password[0]
                                : responseData.password
                        );

                    }

                    else if (
                        responseData?.non_field_errors
                    ) {

                        setError(
                            Array.isArray(
                                responseData.non_field_errors
                            )
                                ? responseData.non_field_errors[0]
                                : responseData.non_field_errors
                        );

                    }

                    else if (responseData?.detail) {

                        setError(
                            responseData.detail
                        );

                    }

                    else {

                        setError(
                            "Invalid login information."
                        );

                    }

                }


                // =============================================
                // 403
                // =============================================

                else if (responseStatus === 403) {

                    setError(
                        responseData?.detail ||
                        "Login permission denied."
                    );

                }


                // =============================================
                // 404
                // =============================================

                else if (responseStatus === 404) {

                    setError(
                        "Login URL not found. Check Django URLs."
                    );

                }


                // =============================================
                // 500
                // =============================================

                else if (responseStatus >= 500) {

                    setError(
                        "Django server error. Check the Django terminal."
                    );

                }


                // =============================================
                // OTHER DJANGO ERROR
                // =============================================

                else if (responseData?.detail) {

                    setError(
                        responseData.detail
                    );

                }


                else {

                    setError(
                        `Login failed. Server returned ${responseStatus}.`
                    );

                }

            }


            // =================================================
            // NO SERVER RESPONSE
            // =================================================

            else if (err.request) {

                setError(
                    "Cannot connect to Django server. Make sure Django is running."
                );

            }


            // =================================================
            // JAVASCRIPT / AXIOS ERROR
            // =================================================

            else {

                setError(
                    err.message ||
                    "Something went wrong."
                );

            }

        }


        // =====================================================
        // FINALLY
        // =====================================================

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <section className="login-page">

            <div className="login-container">

                <div className="login-card">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="login-header">

                        <div className="login-icon">

                            <i className="bi bi-person"></i>

                        </div>


                        <h1>
                            Welcome Back
                        </h1>


                        <p>
                            Login to continue shopping
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="login-error">

                            <i className="bi bi-exclamation-circle"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleLogin}
                    >


                        {/* =================================================
                            USERNAME
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>


                            <div className="input-wrapper">

                                <i className="bi bi-person"></i>


                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    autoComplete="username"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>


                            <div className="input-wrapper">

                                <i className="bi bi-lock"></i>


                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
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


                        {/* =================================================
                            OPTIONS
                        ================================================= */}

                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>

                        </div>


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>


                    {/* =================================================
                        REGISTER
                    ================================================= */}

                    <div className="register-section">

                        <p>
                            Don't have an account?
                        </p>


                        <Link to="/register">
                            Create Account
                        </Link>

                    </div>


                </div>

            </div>

        </section>

    );

}


export default Login;