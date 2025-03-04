from django.urls import path
from . import views

urlpatterns = [
    path('', views.loader_page, name='loader_page'),  # Главная страница (лоадер)
    path('registration/', views.registration_page, name='registration_page'),  # Страница регистрации
    path('home/', views.home_page, name='home_page'),  # Страница регистрации
]