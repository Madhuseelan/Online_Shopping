from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    path(
        "api/",
        include("api.urls")
    ),


    path(
        "admin/",
        admin.site.urls
    ),

    # Accounts
    path(
        "api/accounts/",
        include("accounts.urls")
    ),

    # Products
    path(
        "api/products/",
        include("products.urls")
    ),

    # Cart
    path(
        "api/cart/",
        include("cart.urls")
    ),

    # Orders
    path(
        "api/orders/",
        include("orders.urls")
    ),

]