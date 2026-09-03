import api from "./api";

// GET addresses
export const getAddresses = async () => {
    const response = await api.get("accounts/addresses/");
    return response.data;
};

// ADD address
export const addAddress = async (data) => {
    const response = await api.post(
        "accounts/addresses/",
        data
    );

    return response.data;
};

// UPDATE address
export const editAddress = async (id, data) => {
    const response = await api.put(
        `accounts/addresses/${id}/`,
        data
    );

    return response.data;
};

// DELETE address
export const removeAddress = async (id) => {
    const response = await api.delete(
        `accounts/addresses/${id}/`
    );

    return response.data;
};