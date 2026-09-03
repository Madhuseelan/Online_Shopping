from django.urls import path

from .views import (
    OrderCreateView,
    MyOrdersAPIView,
    OrderDetailView,
    CancelOrderView,
    AdminOrderStatusUpdateView,
)


urlpatterns = [

    path(
        "",
        OrderCreateView.as_view(),
        name="create-order",
    ),

    path(
        "my-orders/",
        MyOrdersAPIView.as_view(),
        name="my-orders",
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),

    path(
        "<int:pk>/cancel/",
        CancelOrderView.as_view(),
        name="cancel-order",
    ),

    path(
        "<int:pk>/status/",
        AdminOrderStatusUpdateView.as_view(),
        name="admin-order-status-update",
    ),
]