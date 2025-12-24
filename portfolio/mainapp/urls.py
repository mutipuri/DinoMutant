from django.urls import path
from mainapp import admin, views

urlpatterns = [
    path("",views.dino, name="main"),
    path("kekka", views.kekka, name="kekka")
]
