from django.contrib import admin

from .models import Order, OrderItem


# =====================================================
# ORDER ITEM INLINE
# =====================================================

class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 0

    readonly_fields = (
        "product",
        "quantity",
        "price",
        "subtotal",
        "created_at",
    )

    can_delete = False


# =====================================================
# ORDER ADMIN
# =====================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    # =================================================
    # ORDER LIST
    # =================================================

    list_display = (
        "id",
        "customer",
        "product",
        "quantity",
        "total_price",
        "status",
        "stock_released",
        "created_at",
    )

    # =================================================
    # FILTER
    # =================================================

    list_filter = (
        "status",
        "stock_released",
        "created_at",
    )

    # =================================================
    # SEARCH
    # =================================================

    search_fields = (
        "customer__username",
        "customer__email",
        "product__name",
    )

    # =================================================
    # ORDERING
    # =================================================

    ordering = (
        "-created_at",
    )

    # =================================================
    # READ ONLY
    # =================================================

    readonly_fields = (
        "created_at",
    )

    # =================================================
    # ORDER ITEMS
    # =================================================

    inlines = [
        OrderItemInline,
    ]