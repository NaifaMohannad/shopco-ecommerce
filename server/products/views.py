from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from .models import Category, DressStyle, Product, Review
from .serializers import (
    CategorySerializer,
    DressStyleSerializer,
    ProductSerializer,
    ProductListSerializer,
    ReviewSerializer
)

# Get all categories
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# Get all dress styles
class DressStyleListView(generics.ListAPIView):
    queryset = DressStyle.objects.all()
    serializer_class = DressStyleSerializer
    permission_classes = [AllowAny]

# Get all products with filtering
class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__icontains=category)

        # Filter by dress style
        dress_style = self.request.query_params.get('dress_style')
        if dress_style:
            queryset = queryset.filter(dress_style__name__icontains=dress_style)

        # Filter by size
        size = self.request.query_params.get('size')
        if size:
            queryset = queryset.filter(variants__size=size)

        # Filter by color
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(variants__color__icontains=color)

        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        # Filter by min price
        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        # Filter by max price
        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset.distinct()

# Get single product details
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

# Get all reviews for a product
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs['pk'])
