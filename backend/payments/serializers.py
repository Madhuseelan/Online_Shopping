from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    order_id = serializers.IntegerField(
        source="order.id",
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "order",
            "order_id",
            "amount",
            "payment_method",
            "status",
            "transaction_id",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_id",
            "status",
            "transaction_id",
            "created_at",
            "updated_at",
        ]