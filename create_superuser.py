import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sorafront.settings")
django.setup()

User = get_user_model()

if not User.objects.filter(username=os.getenv("DJANGO_SUPERUSER_USERNAME")).exists():
    User.objects.create_superuser(
        os.getenv("DJANGO_SUPERUSER_USERNAME"),
        os.getenv("DJANGO_SUPERUSER_EMAIL"),
        os.getenv("DJANGO_SUPERUSER_PASSWORD"),
    )
    print("Superuser created.")
else:
    print("Superuser already exists.")
