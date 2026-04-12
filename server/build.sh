#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Create superuser
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin1').exists():
    User.objects.create_superuser('admin1', 'naifamohanad@gmail.com', 'admin321')
    print('Superuser created!')
else:
    print('Superuser already exists!')
"

# Load products data
python manage.py loaddata products_data.json
echo "Products data loaded!"

# Update product images to Cloudinary
python manage.py shell -c "
import cloudinary
import cloudinary.uploader
from products.models import Product

cloudinary.config(
    cloud_name='dhpozlrwe',
    api_key='466465684641156',
    api_secret='WpFOLSF6gkyUAbDZeNFC9szlxo8'
)

for product in Product.objects.all():
    if product.image:
        image_url = str(product.image)
        if not image_url.startswith('http'):
            try:
                result = cloudinary.uploader.upload(
                    f'https://shopco-api.onrender.com/media/{image_url}',
                    folder='products'
                )
                product.image = result['secure_url']
                product.save()
                print(f'Updated: {product.name}')
            except Exception as e:
                print(f'Error: {product.name} - {e}')

print('All products updated!')
"