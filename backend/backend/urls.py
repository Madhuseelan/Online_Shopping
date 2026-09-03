from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static


# =====================================================
# URL PATTERNS
# =====================================================

urlpatterns = [

    # =================================================
    # ADMIN
    # =================================================

    path(
        "admin/",
        admin.site.urls
    ),


    # =================================================
    # ACCOUNTS
    # =================================================

    path(
        "api/accounts/",
        include("accounts.urls")
    ),


    # =================================================
    # PRODUCTS
    # =================================================

    path(
        "api/products/",
        include("products.urls")
    ),


    # =================================================
    # CART
    # =================================================

    path(
        "api/cart/",
        include("cart.urls")
    ),


    # =================================================
    # ORDERS
    # =================================================

    path(
        "api/orders/",
        include("orders.urls")
    ),


    # =================================================
    # ADDRESSES
    # =================================================

    path(
        "api/addresses/",
        include("addresses.urls")
    ),


    # =================================================
    # PAYMENTS
    # =================================================

    path(
        "api/payments/",
        include("payments.urls")
    ),
]


# =====================================================
# MEDIA FILES
# DEVELOPMENT ONLY
# =====================================================

if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )