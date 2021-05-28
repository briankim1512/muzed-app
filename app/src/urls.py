from django.urls import path

from . import views

# Page urls

urlpatterns = [
    path('', views.index, name='main'),
    path('api', views.api, name='api'),
    path('upload_image', views.upload_image, name='upload_image'),
]