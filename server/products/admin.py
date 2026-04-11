from django.contrib import admin
from .models import Category, DressStyle, Product, ProductVariant, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(DressStyle)
class DressStyleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'original_price', 'discount', 'category', 'dress_style', 'rating']
    search_fields = ['name', 'description']
    list_filter = ['category', 'dress_style']

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'size', 'color', 'stock']
    list_filter = ['size', 'color']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'product', 'rating', 'created_at']
    list_filter = ['rating']