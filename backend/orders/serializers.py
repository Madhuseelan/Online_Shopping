from django.db import transaction

from rest_framework import serializers

from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()


    class Meta:

        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "quantity",
            "price",
            "subtotal",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "product_name",
            "product_image",
            "product_price",
            "price",
            "subtotal",
            "created_at",
        ]


    def get_product_image(self, obj):

        if not obj.product:
            return None

        if not obj.product.image:
            return None

        request = self.context.get("request")

        url = obj.product.image.url

        if request:
            return request.build_absolute_uri(url)

        return url


    def get_subtotal(self, obj):

        return obj.price * obj.quantity


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        required=False
    )

    product_name = serializers.SerializerMethodField()

    product_image = serializers.SerializerMethodField()

    product_price = serializers.SerializerMethodField()


    class Meta:

        model = Order

        fields = [
            "id",
            "customer",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "quantity",
            "total_price",
            "address",
            "status",
            "stock_released",
            "created_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "customer",
            "product_name",
            "product_image",
            "product_price",
            "stock_released",
            "created_at",
        ]


    def get_product_name(self, obj):

        return (
            obj.product.name
            if obj.product
            else None
        )


    def get_product_image(self, obj):

        if not obj.product:
            return None

        if not obj.product.image:
            return None

        request = self.context.get("request")

        url = obj.product.image.url

        if request:
            return request.build_absolute_uri(url)

        return url


    def get_product_price(self, obj):

        return (
            obj.product.price
            if obj.product
            else None
        )


    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop(
            "items",
            []
        )

        order = Order.objects.create(
            **validated_data
        )

        for item_data in items_data:

            product = item_data["product"]

            quantity = int(
                item_data["quantity"]
            )

            product = (
                Product.objects
                .select_for_update()
                .get(pk=product.id)
            )

            if product.stock < quantity:

                raise serializers.ValidationError(
                    {
                        "items": [
                            (
                                f"Insufficient stock for "
                                f"{product.name}. "
                                f"Only {product.stock} "
                                f"item(s) available."
                            )
                        ]
                    }
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

            product.stock -= quantity

            product.save(
                update_fields=["stock"]
            )

        return order