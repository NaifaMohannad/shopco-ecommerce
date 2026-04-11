from django.urls import path
from .views import (
    CategoryListView,
    DressStyleListView,
    ProductListView,
    ProductDetailView,
    ReviewListCreateView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('dress-styles/', DressStyleListView.as_view(), name='dress-style-list'),
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/reviews/', ReviewListCreateView.as_view(), name='review-list'),
]