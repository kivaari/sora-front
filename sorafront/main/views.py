from django.shortcuts import render

def loader_page(request):
    return render(request, 'main/loader.html')

def registration_page(request):
    return render(request, 'main/registration.html')

def home_page(request):
    return render(request, 'main/home.html')