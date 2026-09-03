from django.db import models
from django.contrib.auth.models import User

from products.models import Product


# =====================================================
# ORDER
# =====================================================

class Order(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Processing", "Processing"),
        ("Shipped", "Shipped"),
        ("Out for Delivery", "Out for Delivery"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
        ("Returned", "Returned"),
        ("Refunded", "Refunded"),
        ("Failed", "Failed"),
    ]

    # =====================================================
    # CUSTOMER
    # =====================================================

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    # =====================================================
    # LEGACY PRODUCT
    # Kept for old orders
    # =====================================================

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    # =====================================================
    # ORDER TOTAL
    # =====================================================

    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    # =====================================================
    # ADDRESS
    # =====================================================

    address = models.TextField()

    # =====================================================
    # STATUS
    # =====================================================

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    # =====================================================
    # STOCK RESTORED
    # =====================================================

    stock_released = models.BooleanField(
        default=False
    )

    # =====================================================
    # CREATED
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # =====================================================
    # ALLOWED STATUS TRANSITIONS
    # =====================================================

    STATUS_TRANSITIONS = {

        "Pending": [
            "Confirmed",
            "Cancelled",
            "Failed",
        ],

        "Confirmed": [
            "Processing",
            "Cancelled",
        ],

        "Processing": [
            "Shipped",
        ],

        "Shipped": [
            "Out for Delivery",
        ],

        "Out for Delivery": [
            "Delivered",
        ],

        "Delivered": [
            "Returned",
        ],

        "Returned": [
            "Refunded",
        ],

        "Cancelled": [],

        "Refunded": [],

        "Failed": [],
    }

    # =====================================================
    # CHECK STATUS TRANSITION
    # =====================================================

    def can_change_status(self, new_status):

        valid_statuses = dict(
            self.STATUS_CHOICES
        )

        if new_status not in valid_statuses:
            return False

        if new_status == self.status:
            return True

        return new_status in self.STATUS_TRANSITIONS.get(
            self.status,
            []
        )

    # =====================================================
    # CHANGE STATUS
    # =====================================================

    def change_status(self, new_status):

        if not self.can_change_status(
            new_status
        ):
            raise ValueError(
                f"Cannot change order status "
                f"from '{self.status}' "
                f"to '{new_status}'."
            )

        self.status = new_status

    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):

        return f"Order #{self.id}"


# =====================================================
# ORDER ITEM
# =====================================================

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):

        return (
            f"{self.product.name} "
            f"x {self.quantity}"
        )

    @property
    def subtotal(self):

        return self.price * self.quantity