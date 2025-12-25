from django.urls import path
from mainapp import admin, views

urlpatterns = [
    path("",views.dino, name="main"),
    path("kekka", views.dino, name="kekka"),
    path('simula/', views.simulation, name='simulation'),
]
