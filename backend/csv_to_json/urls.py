from django.urls import path
from .views import (
    hello_world,
    CSVUploadView,
    JSONDownloadView,
    EmailSendView
)

urlpatterns = [
    path('hello-world/', hello_world, name='hello_world'),
    path('upload/', CSVUploadView.as_view(), name='csv-upload'),
    path('download/<int:pk>/',
         JSONDownloadView.as_view(),
         name='json-download'),
    path('email_user/<int:pk>/', EmailSendView.as_view(), name='email-send'),
]
