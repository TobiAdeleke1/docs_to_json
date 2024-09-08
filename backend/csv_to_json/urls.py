from django.urls import path
from .views import hello_world, CSVUploadView

urlpatterns = [
    path('hello-world/', hello_world, name='hello_world'),
    path('upload/', CSVUploadView.as_view(), name='csv-upload'),
]
