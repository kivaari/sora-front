from django.shortcuts import render, redirect
from .forms import RegisterForm


def loader_page(request):
    return render(request, "main/loader.html")


def registration_page(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home_page")
    else:
        form = RegisterForm()
    return render(request, "main/registration.html", {"form": form})


def home_page(request):
    return render(request, "main/home.html")

