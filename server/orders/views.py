from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from .models import Order, OrderItem
from cart.models import Cart
from products.models import Product, ProductVariant
from .serializers import OrderSerializer

# Get all orders & Create order
class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # Get order history
    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    # Place order from cart
    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty!'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()

        if not cart_items:
            return Response({'error': 'Cart is empty!'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total
        subtotal = sum(item.product.price * item.quantity for item in cart_items)
        discount = Decimal(str(request.data.get('discount', 0)))
        delivery_fee = Decimal('15')
        total = subtotal - discount + delivery_fee

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total,
            discount=discount,
            delivery_fee=delivery_fee
        )

        # Create order items from cart
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear cart after order
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Get single order detail
class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)