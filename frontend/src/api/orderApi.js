import api from "./api";


export async function createOrder(orderData){

    const response =
        await api.post(
            "orders/create/",
            orderData
        );


    return response.data;

}