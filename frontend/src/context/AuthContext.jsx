import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginUser,
    registerUser,
    getCurrentCustomer,
    logoutUser,
} from "../api/authApi";

// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext = createContext(null);

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // =================================================
    // CHECK LOGIN
    // =================================================

    useEffect(() => {

        async function checkCustomer() {

            const token =
                localStorage.getItem("accessToken");

            // -----------------------------------------
            // NO TOKEN
            // -----------------------------------------

            if (!token) {
                setCustomer(null);
                setLoading(false);
                return;
            }

            // -----------------------------------------
            // TOKEN EXISTS
            // -----------------------------------------

            try {

                const data =
                    await getCurrentCustomer();

                setCustomer(data);

                localStorage.setItem(
                    "customer",
                    JSON.stringify(data)
                );

            } catch (error) {

                console.error(
                    "AUTHENTICATION ERROR:",
                    error.response?.data ||
                    error.message
                );

                logoutUser();

                setCustomer(null);

            } finally {

                setLoading(false);

            }
        }

        checkCustomer();

    }, []);

    // =================================================
    // LOGIN
    // =================================================

    async function login(username, password) {

        const data =
            await loginUser({
                username,
                password,
            });

        // -----------------------------------------
        // GET ACTUAL CUSTOMER PROFILE
        // -----------------------------------------

        try {

            const customerData =
                await getCurrentCustomer();

            setCustomer(customerData);

            localStorage.setItem(
                "customer",
                JSON.stringify(customerData)
            );

        } catch (error) {

            console.error(
                "CUSTOMER LOAD ERROR:",
                error
            );

            // Fallback
            if (data.user) {

                setCustomer(data.user);

                localStorage.setItem(
                    "customer",
                    JSON.stringify(data.user)
                );
            }
        }

        return data;
    }

    // =================================================
    // REGISTER
    // =================================================

    async function register(
        username,
        email,
        password
    ) {

        const data =
            await registerUser({
                username,
                email,
                password,
            });

        return data;
    }

    // =================================================
    // LOGOUT
    // =================================================

    function logout() {

        logoutUser();

        setCustomer(null);

        localStorage.removeItem(
            "customer"
        );
    }

    // =================================================
    // CONTEXT VALUE
    // =================================================

    const value = {

        customer,

        loading,

        login,

        register,

        logout,

        isLoggedIn: !!customer,
    };

    // =================================================
    // PROVIDER
    // =================================================

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// =====================================================
// USE AUTH
// =====================================================

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}