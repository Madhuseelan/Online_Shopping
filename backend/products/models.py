from django.db import models


class Product(models.Model):

    # =====================================================
    # PRODUCT NAME
    # =====================================================

    name = models.CharField(
        max_length=200
    )


    # =====================================================
    # PRICE
    # =====================================================

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    # =====================================================
    # PRODUCT IMAGE
    # =====================================================

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True
    )


    # =====================================================
    # DESCRIPTION
    # =====================================================

    description = models.TextField(
        blank=True,
        null=True
    )


    # =====================================================
    # CATEGORY
    # =====================================================

    category = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )


    # =====================================================
    # STOCK
    # =====================================================

    stock = models.PositiveIntegerField(
        default=0
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


    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):
        return self.name