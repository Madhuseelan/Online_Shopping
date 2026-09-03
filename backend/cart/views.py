from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


# ============================================================
# GET CURRENT USER CART
# ============================================================

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(
            cart,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# ADD PRODUCT TO CART
# ============================================================

class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_id = request.data.get("product")
        quantity = request.data.get("quantity", 1)

        # ----------------------------------------------------
        # PRODUCT ID VALIDATION
        # ----------------------------------------------------

        if not product_id:

            return Response(
                {
                    "detail": "Product ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # QUANTITY VALIDATION
        # ----------------------------------------------------

        try:

            quantity = int(quantity)

        except (TypeError, ValueError):

            return Response(
                {
                    "detail": "Quantity must be a valid number."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:

            return Response(
                {
                    "detail": "Quantity must be at least 1."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # GET PRODUCT
        # ----------------------------------------------------

        product = get_object_or_404(
            Product,
            id=product_id
        )

        # ----------------------------------------------------
        # GET / CREATE USER CART
        # ----------------------------------------------------

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        # ----------------------------------------------------
        # GET / CREATE CART ITEM
        # ----------------------------------------------------

        cart_item, item_created = CartItem.objects.get_or_create(

            cart=cart,

            product=product,

            defaults={
                "quantity": quantity
            }

        )

        # ----------------------------------------------------
        # PRODUCT ALREADY EXISTS IN CART
        # ----------------------------------------------------

        if not item_created:

            cart_item.quantity += quantity

            cart_item.save(
                update_fields=["quantity"]
            )

        # ----------------------------------------------------
        # RETURN UPDATED CART
        # ----------------------------------------------------

        serializer = CartSerializer(
            cart,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# UPDATE CART ITEM QUANTITY
# ============================================================

class UpdateCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):

        # ----------------------------------------------------
        # GET CURRENT USER CART
        # ----------------------------------------------------

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        # ----------------------------------------------------
        # GET ONLY ITEM BELONGING TO THIS CART
        # ----------------------------------------------------

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        quantity = request.data.get("quantity")

        # ----------------------------------------------------
        # QUANTITY VALIDATION
        # ----------------------------------------------------

        try:

            quantity = int(quantity)

        except (TypeError, ValueError):

            return Response(
                {
                    "detail": "Quantity must be a valid number."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:

            return Response(
                {
                    "detail": "Quantity must be at least 1."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # UPDATE QUANTITY
        # ----------------------------------------------------

        cart_item.quantity = quantity

        cart_item.save(
            update_fields=["quantity"]
        )

        # ----------------------------------------------------
        # RETURN UPDATED CART
        # ----------------------------------------------------

        serializer = CartSerializer(
            cart,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# REMOVE CART ITEM
# ============================================================

class RemoveCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        # ----------------------------------------------------
        # GET CURRENT USER CART
        # ----------------------------------------------------

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        # ----------------------------------------------------
        # GET ITEM FROM THIS USER'S CART ONLY
        # ----------------------------------------------------

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        # ----------------------------------------------------
        # DELETE ITEM
        # ----------------------------------------------------

        cart_item.delete()

        # ----------------------------------------------------
        # RETURN UPDATED CART
        # ----------------------------------------------------

        serializer = CartSerializer(
            cart,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# CLEAR CART
# ============================================================

class ClearCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):

        # ----------------------------------------------------
        # GET CURRENT USER CART
        # ----------------------------------------------------

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        # ----------------------------------------------------
        # DELETE ALL CART ITEMS
        # ----------------------------------------------------

        cart.items.all().delete()

        # ----------------------------------------------------
        # RETURN EMPTY CART
        # ----------------------------------------------------

        serializer = CartSerializer(
            cart,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )