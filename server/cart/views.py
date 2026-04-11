from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from products.models import Product, ProductVariant
from .serializers import CartSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    # Get cart
    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    # Add item to cart
    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)

        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found!'}, status=status.HTTP_404_NOT_FOUND)

        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant_id=variant_id
        )

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()
        else:
            cart_item.quantity = int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    # Remove item from cart
    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        item_id = request.data.get('item_id')

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found!'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(cart)
        return Response(serializer.data)
    # Update cart item quantity
    def put(self, request):
       cart = Cart.objects.get(user=request.user)
       item_id = request.data.get('item_id')
       quantity = request.data.get('quantity')
       try:
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        cart_item.quantity = int(quantity)
        cart_item.save()
       except CartItem.DoesNotExist:
        return Response({'error': 'Item not found!'}, status=status.HTTP_404_NOT_FOUND)
       serializer = CartSerializer(cart)
       return Response(serializer.data)