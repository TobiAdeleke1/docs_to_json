from django.db import models


class CSVUpload(models.Model):
    file = models.FileField(upload_to='uploads/')
    file_name = models.CharField(max_length=155, blank=True, null=True)
    result_url = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.file_name
