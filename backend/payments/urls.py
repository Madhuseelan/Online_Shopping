from django.urls import path

from .views import (
    PaymentCreateView,
    PaymentVerifyView,
    PaymentCancelView,
    PaymentDetailView,
)


urlpatterns = [

    # CREATE RAZORPAY ORDER
    path(
        "",
        PaymentCreateView.as_view(),
        name="create-payment",
    ),

    # VERIFY PAYMENT
    path(
        "verify/",
        PaymentVerifyView.as_view(),
        name="verify-payment",
    ),

    # CANCEL PAYMENT
    path(
        "cancel/",
        PaymentCancelView.as_view(),
        name="cancel-payment",
    ),

    # PAYMENT DETAILS
    path(
        "<int:pk>/",
        PaymentDetailView.as_view(),
        name="payment-detail",
    ),
]