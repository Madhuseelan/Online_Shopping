import api from "./api";


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export async function getProducts() {

    try {

        const response =
            await api.get(
                "products/"
            );


        console.log(
            "PRODUCT RESPONSE:",
            response.data
        );


        return response.data;

    } catch (error) {

        console.error(
            "PRODUCT ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

}


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export async function getProduct(id) {

    try {

        const response =
            await api.get(
                `products/${id}/`
            );


        return response.data;

    } catch (error) {

        console.error(
            "SINGLE PRODUCT ERROR:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

}