from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Order
from .serializers import OrderSerializer


# =====================================================
# JWT AUTHENTICATED BASE VIEW
# =====================================================

class JWTAuthenticatedAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


# =====================================================
# STOCK RESTORATION
# =====================================================

def restore_order_stock(order):

    # Prevent restoring stock more than once
    if getattr(order, "stock_released", False):
        return

    # -------------------------------------------------
    # MULTI-PRODUCT ORDER
    # -------------------------------------------------

    items = list(
        order.items.select_related("product").all()
    )

    if items:

        for item in items:

            product = item.product

            product.stock += item.quantity

            product.save(
                update_fields=["stock"]
            )

    # -------------------------------------------------
    # SINGLE-PRODUCT ORDER
    # -------------------------------------------------

    elif order.product is not None:

        product = order.product

        product.stock += order.quantity

        product.save(
            update_fields=["stock"]
        )

    # -------------------------------------------------
    # MARK STOCK AS RELEASED
    # -------------------------------------------------

    order.stock_released = True

    order.save(
        update_fields=["stock_released"]
    )


# =====================================================
# CREATE ORDER
# POST /api/orders/
# =====================================================

class OrderCreateView(JWTAuthenticatedAPIView):

    @transaction.atomic
    def post(self, request):

        serializer = OrderSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        order = serializer.save(
            customer=request.user
        )

        response_serializer = OrderSerializer(
            order,
            context={
                "request": request
            }
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


# =====================================================
# MY ORDERS
# GET /api/orders/my-orders/
# =====================================================

class MyOrdersAPIView(JWTAuthenticatedAPIView):

    def get(self, request):

        orders = (
            Order.objects
            .filter(
                customer=request.user
            )
            .prefetch_related(
                "items__product"
            )
            .order_by(
                "-created_at"
            )
        )

        serializer = OrderSerializer(
            orders,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =====================================================
# ORDER DETAIL
# GET /api/orders/<id>/
# =====================================================

class OrderDetailView(JWTAuthenticatedAPIView):

    def get(self, request, pk):

        try:

            order = (
                Order.objects
                .filter(
                    pk=pk,
                    customer=request.user
                )
                .prefetch_related(
                    "items__product"
                )
                .get()
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(
            order,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =====================================================
# CANCEL ORDER
# POST /api/orders/<id>/cancel/
# =====================================================

class CancelOrderView(JWTAuthenticatedAPIView):

    @transaction.atomic
    def post(self, request, pk):

        try:

            order = (
                Order.objects
                .select_for_update()
                .filter(
                    pk=pk,
                    customer=request.user
                )
                .prefetch_related(
                    "items__product"
                )
                .get()
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # ORDERS THAT CANNOT BE CANCELLED
        # -------------------------------------------------

        non_cancellable_statuses = [
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Returned",
            "Refunded",
            "Cancelled",
            "Failed",
        ]

        if order.status in non_cancellable_statuses:

            return Response(
                {
                    "detail": (
                        "Order cannot be cancelled "
                        "because its status is "
                        f"{order.status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # RESTORE STOCK
        # -------------------------------------------------

        restore_order_stock(order)

        # -------------------------------------------------
        # CANCEL ORDER
        # -------------------------------------------------

        order.status = "Cancelled"

        order.save(
            update_fields=[
                "status"
            ]
        )

        serializer = OrderSerializer(
            order,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =====================================================
# ADMIN ORDER STATUS UPDATE
# PATCH /api/orders/<id>/status/
# =====================================================

class AdminOrderStatusUpdateView(JWTAuthenticatedAPIView):

    @transaction.atomic
    def patch(self, request, pk):

        # =================================================
        # ADMIN CHECK
        # =================================================

        if not request.user.is_staff:

            return Response(
                {
                    "detail": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # =================================================
        # GET ORDER
        # =================================================

        try:

            order = (
                Order.objects
                .select_for_update()
                .prefetch_related(
                    "items__product"
                )
                .get(
                    pk=pk
                )
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # =================================================
        # GET NEW STATUS
        # =================================================

        new_status = request.data.get(
            "status"
        )

        if not new_status:

            return Response(
                {
                    "detail": "Status is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # VALID STATUS
        # =================================================

        valid_statuses = dict(
            Order.STATUS_CHOICES
        )

        if new_status not in valid_statuses:

            return Response(
                {
                    "detail":
                        f"Invalid status: {new_status}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # SAME STATUS
        # =================================================

        if new_status == order.status:

            return Response(
                {
                    "detail": (
                        f"Order already has "
                        f"status '{new_status}'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # STATUS TRANSITION
        # =================================================

        if not order.can_change_status(
            new_status
        ):

            return Response(
                {
                    "detail": (
                        "Invalid status transition: "
                        f"{order.status} → {new_status}"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # REFUND RULE
        # =================================================

        if new_status == "Refunded":

            if order.status != "Returned":

                return Response(
                    {
                        "detail": (
                            "Order must be Returned "
                            "before it can be Refunded."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # =================================================
        # CHANGE STATUS
        # =================================================

        try:

            order.change_status(
                new_status
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # SAVE
        # =================================================

        order.save(
            update_fields=[
                "status"
            ]
        )

        # =================================================
        # RESPONSE
        # =================================================

        serializer = OrderSerializer(
            order,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )