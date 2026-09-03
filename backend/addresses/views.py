from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Address
from .serializers import AddressSerializer


# =====================================================
# ADDRESS LIST + CREATE
# =====================================================

class AddressListView(APIView):

    permission_classes = [IsAuthenticated]

    # -------------------------------------------------
    # GET /api/addresses/
    # -------------------------------------------------

    def get(self, request):

        addresses = Address.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = AddressSerializer(
            addresses,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -------------------------------------------------
    # POST /api/addresses/
    # -------------------------------------------------

    def post(self, request):

        serializer = AddressSerializer(
            data=request.data
        )

        if serializer.is_valid():

            address = serializer.save(
                user=request.user
            )

            return Response(
                AddressSerializer(address).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =====================================================
# ADDRESS DETAIL
# =====================================================

class AddressDetailView(APIView):

    permission_classes = [IsAuthenticated]

    # -------------------------------------------------
    # GET ADDRESS OBJECT
    # -------------------------------------------------

    def get_object(self, request, pk):

        try:
            return Address.objects.get(
                pk=pk,
                user=request.user
            )

        except Address.DoesNotExist:
            return None

    # -------------------------------------------------
    # GET /api/addresses/<id>/
    # -------------------------------------------------

    def get(self, request, pk):

        address = self.get_object(
            request,
            pk
        )

        if address is None:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AddressSerializer(
            address
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -------------------------------------------------
    # PUT /api/addresses/<id>/
    # -------------------------------------------------

    def put(self, request, pk):

        address = self.get_object(
            request,
            pk
        )

        if address is None:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AddressSerializer(
            address,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------------------------------
    # PATCH /api/addresses/<id>/
    # -------------------------------------------------

    def patch(self, request, pk):

        address = self.get_object(
            request,
            pk
        )

        if address is None:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AddressSerializer(
            address,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------------------------------
    # DELETE /api/addresses/<id>/
    # -------------------------------------------------

    def delete(self, request, pk):

        address = self.get_object(
            request,
            pk
        )

        if address is None:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        address.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )