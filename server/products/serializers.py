from rest_framework import serializers
from .models import Category, DressStyle, Product, ProductVariant, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class DressStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DressStyle
        fields = ['id', 'name']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'stock']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    dress_style = DressStyleSerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price',
            'original_price', 'discount', 'image',
            'category', 'dress_style', 'rating',
            'variants', 'reviews', 'created_at'
        ]

    def get_image(self, obj):
        if obj.image:
            return f'http://127.0.0.1:8000/media/{obj.image}'
        return None

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    dress_style = DressStyleSerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'original_price',
            'discount', 'image', 'category',
            'dress_style', 'rating'
        ]

    def get_image(self, obj):
        if obj.image:
            return f'http://127.0.0.1:8000/media/{obj.image}'
        return None