import axios from "axios";


// =====================================================
// AXIOS
// =====================================================

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("accessToken");

        if (token) {
            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// =====================================================
// REGISTER
// =====================================================

// POST /api/accounts/register/

export async function registerUser(userData) {
    const response = await api.post(
        "accounts/register/",
        userData
    );

    return response.data;
}


// =====================================================
// LOGIN
// =====================================================

// POST /api/accounts/login/

export async function loginUser(credentials) {
    const response = await api.post(
        "accounts/login/",
        credentials
    );

    // Save access token
    if (response.data?.access) {
        localStorage.setItem(
            "accessToken",
            response.data.access
        );
    }

    // Save refresh token
    if (response.data?.refresh) {
        localStorage.setItem(
            "refreshToken",
            response.data.refresh
        );
    }

    return response.data;
}


// =====================================================
// CURRENT CUSTOMER
// =====================================================

// GET /api/accounts/profile/

export async function getCurrentCustomer() {
    const response = await api.get(
        "accounts/profile/"
    );

    return response.data;
}
// =====================================================
// LOGOUT
// =====================================================

export function logoutUser() {
    localStorage.removeItem(
        "accessToken"
    );

    localStorage.removeItem(
        "refreshToken"
    );

    localStorage.removeItem(
        "customer"
    );

    localStorage.removeItem(
        "rememberMe"
    );
}


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;