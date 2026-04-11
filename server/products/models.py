from django.db import models

# Category Model (T-shirts, Shorts, Shirts etc.)
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


# Dress Style Model (Casual, Formal, Party, Gym)
class DressStyle(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Dress Styles"


# Product Model
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    dress_style = models.ForeignKey(DressStyle, on_delete=models.SET_NULL, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Product Variant Model (sizes and colors)
class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ('XX-Small', 'XX-Small'),
        ('X-Small', 'X-Small'),
        ('Small', 'Small'),
        ('Medium', 'Medium'),
        ('Large', 'Large'),
        ('X-Large', 'X-Large'),
        ('XX-Large', 'XX-Large'),
        ('3X-Large', '3X-Large'),
        ('4X-Large', '4X-Large'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=20, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"


# Review Model
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.product.name}"
# Create your models here.
