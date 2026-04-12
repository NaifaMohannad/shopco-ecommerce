from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'SHOP.CO API is running! 🎉',
        'endpoints': {
            'products': '/api/products/',
            'auth': '/api/auth/',
            'cart': '/api/cart/',
            'orders': '/api/orders/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/auth/', include('users.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)