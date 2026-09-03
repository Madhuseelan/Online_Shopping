import razorpay

from django.conf import settings
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from orders.models import Order

from .models import Payment
from .serializers import PaymentSerializer


# =====================================================
# RAZORPAY CLIENT
# =====================================================

razorpay_client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET,
    )
)

# Retry temporary network failures
razorpay_client.enable_retry(True)

# Application information
razorpay_client.set_app_details({
    "title": "SnapShop",
    "version": "1.0.0",
})


# =====================================================
# RESTORE ORDER STOCK
# =====================================================

def restore_order_stock(order):
    """
    Restore stock for a multi-product order.

    Prevents restoring the same stock twice.
    """

    if order.stock_released:
        return


    # =================================================
    # MULTI-PRODUCT ORDER
    # =================================================

    items = list(
        order.items.select_related(
            "product"
        ).all()
    )

    if items:

        for item in items:

            product = item.product

            product.stock += item.quantity

            product.save(
                update_fields=[
                    "stock"
                ]
            )


    # =================================================
    # LEGACY SINGLE-PRODUCT ORDER
    # =================================================

    elif order.product is not None:

        product = order.product

        product.stock += order.quantity

        product.save(
            update_fields=[
                "stock"
            ]
        )


    # =================================================
    # MARK STOCK AS RELEASED
    # =================================================

    order.stock_released = True

    order.save(
        update_fields=[
            "stock_released"
        ]
    )


# =====================================================
# CREATE PAYMENT
# POST /api/payments/
# =====================================================

class PaymentCreateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request):

        order_id = request.data.get(
            "order_id"
        )

        payment_method = request.data.get(
            "payment_method",
            "Online"
        )


        # =================================================
        # VALIDATE ORDER ID
        # =================================================

        if not order_id:

            return Response(
                {
                    "order_id": [
                        "Order ID is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # GET CUSTOMER ORDER
        # =================================================

        try:

            order = Order.objects.get(
                pk=order_id,
                customer=request.user
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "detail":
                        "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        # =================================================
        # CHECK ORDER STATUS
        # =================================================

        if order.status in [
            "Cancelled",
            "Failed",
            "Returned",
            "Refunded",
        ]:

            return Response(
                {
                    "detail":
                        (
                            "Payment cannot be created "
                            f"for an order with status "
                            f"{order.status}."
                        )
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # EXISTING PAYMENT
        # =================================================

        existing_payment = (
            Payment.objects
            .filter(
                order=order
            )
            .first()
        )


        if existing_payment:

            # ---------------------------------------------
            # ALREADY SUCCESSFUL
            # ---------------------------------------------

            if existing_payment.status == "Success":

                return Response(
                    {
                        "detail":
                            "This order is already paid."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # EXISTING RAZORPAY ORDER
            # ---------------------------------------------

            if (
                existing_payment.razorpay_order_id
            ):

                return Response(
                    {
                        "payment_id":
                            existing_payment.id,

                        "order_id":
                            order.id,

                        "razorpay_order_id":
                            existing_payment
                                .razorpay_order_id,

                        "amount":
                            str(
                                existing_payment.amount
                            ),

                        "amount_paise":
                            int(
                                existing_payment.amount
                                * 100
                            ),

                        "currency":
                            "INR",

                        "key_id":
                            settings.RAZORPAY_KEY_ID,

                        "status":
                            existing_payment.status,
                    },
                    status=status.HTTP_200_OK
                )


        # =================================================
        # PAYMENT AMOUNT
        # =================================================

        amount_rupees = order.total_price

        amount_paise = int(
            amount_rupees * 100
        )


        if amount_paise <= 0:

            return Response(
                {
                    "detail":
                        "Invalid payment amount."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # CREATE RAZORPAY ORDER
        # =================================================

        try:

            razorpay_order = (
                razorpay_client.order.create(
                    {
                        "amount":
                            amount_paise,

                        "currency":
                            "INR",

                        "receipt":
                            f"order_{order.id}",
                    }
                )
            )

        except Exception as exc:

            return Response(
                {
                    "detail":
                        "Unable to create Razorpay order.",

                    "error":
                        str(exc),
                },
                status=status.HTTP_502_BAD_GATEWAY
            )


        # =================================================
        # CREATE LOCAL PAYMENT
        # =================================================

        if existing_payment:

            payment = existing_payment

            payment.amount = order.total_price

            payment.payment_method = (
                payment_method
            )

            payment.status = "Pending"

            payment.razorpay_order_id = (
                razorpay_order["id"]
            )

            payment.save()

        else:

            payment = Payment.objects.create(

                order=order,

                amount=order.total_price,

                payment_method=payment_method,

                status="Pending",

                razorpay_order_id=
                    razorpay_order["id"],
            )


        # =================================================
        # RESPONSE
        # =================================================

        return Response(
            {
                "payment_id":
                    payment.id,

                "order_id":
                    order.id,

                "razorpay_order_id":
                    razorpay_order["id"],

                "amount":
                    str(order.total_price),

                "amount_paise":
                    amount_paise,

                "currency":
                    "INR",

                "key_id":
                    settings.RAZORPAY_KEY_ID,

                "status":
                    payment.status,
            },
            status=status.HTTP_201_CREATED
        )


# =====================================================
# VERIFY PAYMENT
# POST /api/payments/verify/
# =====================================================

class PaymentVerifyView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request):

        payment_id = request.data.get(
            "payment_id"
        )

        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )

        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )

        razorpay_signature = request.data.get(
            "razorpay_signature"
        )


        # =================================================
        # REQUIRED FIELDS
        # =================================================

        if not payment_id:

            return Response(
                {
                    "payment_id": [
                        "Payment ID is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        if not razorpay_payment_id:

            return Response(
                {
                    "razorpay_payment_id": [
                        "Razorpay payment ID is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        if not razorpay_order_id:

            return Response(
                {
                    "razorpay_order_id": [
                        "Razorpay order ID is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        if not razorpay_signature:

            return Response(
                {
                    "razorpay_signature": [
                        "Razorpay signature is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # GET PAYMENT
        # =================================================

        try:

            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(
                    pk=payment_id,
                    order__customer=request.user
                )
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "detail":
                        "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        # =================================================
        # ALREADY SUCCESSFUL
        # =================================================

        if payment.status == "Success":

            return Response(
                {
                    "detail":
                        "Payment already verified.",

                    "payment":
                        PaymentSerializer(
                            payment
                        ).data,
                },
                status=status.HTTP_200_OK
            )


        # =================================================
        # VERIFY RAZORPAY ORDER ID
        # =================================================

        if (
            payment.razorpay_order_id
            != razorpay_order_id
        ):

            return Response(
                {
                    "detail":
                        "Razorpay order ID does not match."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # VERIFY SIGNATURE
        # =================================================

        try:

            razorpay_client.utility.verify_payment_signature(
                {
                    "razorpay_order_id":
                        payment.razorpay_order_id,

                    "razorpay_payment_id":
                        razorpay_payment_id,

                    "razorpay_signature":
                        razorpay_signature,
                }
            )

        except Exception:

            # ---------------------------------------------
            # PAYMENT FAILED
            # ---------------------------------------------

            payment.status = "Failed"

            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment.razorpay_signature = (
                razorpay_signature
            )

            payment.transaction_id = (
                razorpay_payment_id
            )

            payment.save(
                update_fields=[
                    "status",
                    "razorpay_payment_id",
                    "razorpay_signature",
                    "transaction_id",
                    "updated_at",
                ]
            )


            # ---------------------------------------------
            # RESTORE STOCK
            # ---------------------------------------------

            order = payment.order

            restore_order_stock(
                order
            )


            # ---------------------------------------------
            # MARK ORDER FAILED
            # ---------------------------------------------

            order.status = "Failed"

            order.save(
                update_fields=[
                    "status"
                ]
            )


            return Response(
                {
                    "detail":
                        "Payment verification failed.",
                    "payment_status":
                        "Failed",
                    "order_status":
                        "Failed",
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # PAYMENT SUCCESS
        # =================================================

        payment.status = "Success"

        payment.razorpay_payment_id = (
            razorpay_payment_id
        )

        payment.razorpay_signature = (
            razorpay_signature
        )

        payment.transaction_id = (
            razorpay_payment_id
        )

        payment.save(
            update_fields=[
                "status",
                "razorpay_payment_id",
                "razorpay_signature",
                "transaction_id",
                "updated_at",
            ]
        )


        # =================================================
        # CONFIRM ORDER
        # =================================================

        order = payment.order

        if order.status == "Pending":

            order.status = "Confirmed"

            order.save(
                update_fields=[
                    "status"
                ]
            )


        # =================================================
        # SUCCESS RESPONSE
        # =================================================

        return Response(
            {
                "message":
                    "Payment verified successfully.",

                "payment":
                    PaymentSerializer(
                        payment
                    ).data,

                "order":
                    {
                        "id":
                            order.id,

                        "status":
                            order.status,
                    },
            },
            status=status.HTTP_200_OK
        )


# =====================================================
# CANCEL PAYMENT
# POST /api/payments/cancel/
# =====================================================

class PaymentCancelView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request):

        payment_id = request.data.get(
            "payment_id"
        )


        # =================================================
        # VALIDATE
        # =================================================

        if not payment_id:

            return Response(
                {
                    "payment_id": [
                        "Payment ID is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # GET PAYMENT
        # =================================================

        try:

            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(
                    pk=payment_id,
                    order__customer=request.user
                )
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "detail":
                        "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        # =================================================
        # ALREADY SUCCESSFUL
        # =================================================

        if payment.status == "Success":

            return Response(
                {
                    "detail":
                        "Successful payment cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # =================================================
        # ALREADY CANCELLED
        # =================================================

        if payment.status == "Cancelled":

            return Response(
                {
                    "message":
                        "Payment was already cancelled.",

                    "payment":
                        PaymentSerializer(
                            payment
                        ).data,
                },
                status=status.HTTP_200_OK
            )


        # =================================================
        # CANCEL PAYMENT
        # =================================================

        payment.status = "Cancelled"

        payment.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )


        # =================================================
        # RESTORE STOCK
        # =================================================

        order = payment.order

        restore_order_stock(
            order
        )


        # =================================================
        # CANCEL ORDER
        # =================================================

        order.status = "Cancelled"

        order.save(
            update_fields=[
                "status"
            ]
        )


        # =================================================
        # RESPONSE
        # =================================================

        return Response(
            {
                "message":
                    "Payment cancelled successfully.",

                "payment":
                    PaymentSerializer(
                        payment
                    ).data,

                "order":
                    {
                        "id":
                            order.id,

                        "status":
                            order.status,
                    },
            },
            status=status.HTTP_200_OK
        )


# =====================================================
# PAYMENT DETAIL
# GET /api/payments/<id>/
# =====================================================

class PaymentDetailView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pk):

        try:

            payment = (
                Payment.objects
                .select_related("order")
                .get(
                    pk=pk,
                    order__customer=request.user
                )
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "detail":
                        "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        serializer = PaymentSerializer(
            payment
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )