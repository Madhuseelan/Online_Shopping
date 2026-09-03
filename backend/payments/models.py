from django.db import models

from orders.models import Order


class Payment(models.Model):

    PAYMENT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Success", "Success"),
        ("Failed", "Failed"),
        ("Cancelled", "Cancelled"),
    ]

    # =====================================================
    # ORDER
    # =====================================================

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    # =====================================================
    # AMOUNT
    # =====================================================

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    # =====================================================
    # PAYMENT METHOD
    # =====================================================

    payment_method = models.CharField(
        max_length=50,
        default="Online"
    )

    # =====================================================
    # STATUS
    # =====================================================

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Pending"
    )

    # =====================================================
    # RAZORPAY ORDER ID
    # =====================================================

    razorpay_order_id = models.CharField(
        max_length=200,
        unique=True,
        blank=True,
        null=True
    )

    # =====================================================
    # RAZORPAY PAYMENT ID
    # =====================================================

    razorpay_payment_id = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    # =====================================================
    # RAZORPAY SIGNATURE
    # =====================================================

    razorpay_signature = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    # =====================================================
    # TRANSACTION ID
    # =====================================================

    transaction_id = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    # =====================================================
    # CREATED
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # =====================================================
    # UPDATED
    # =====================================================

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"Payment #{self.id} - "
            f"Order #{self.order.id}"
        )