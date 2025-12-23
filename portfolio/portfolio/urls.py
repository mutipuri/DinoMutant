"""
URL configuration for portfolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from mainapp import views
from mainapp import views as main_views
from subapp import views as sub_views

urlpatterns = [
    # path('', admin.site.urls),
    # ""のとき、templatesのindex.htmlを表示する
    path("", views.index, name="index"),
    path("simu/",include("mainapp.urls")),
    path("shousai/", include("subapp.urls")),
]
