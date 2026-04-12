#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Test Cloudinary connection
python manage.py shell -c "
import cloudinary
import cloudinary.uploader
from django.conf import settings
print('Cloudinary config:')
print('Cloud name:', settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'))
print('API Key:', settings.CLOUDINARY_STORAGE.get('API_KEY'))
print('Storage:', settings.DEFAULT_FILE_STORAGE)
"

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