import csv
from rest_framework import serializers
from .models import CSVUpload


class CSVUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVUpload
        fields = ['file']

    def validate(self, attrs):
        """
        To validate the file extension, size and csv readability
        """
        file = attrs.get('file')

        if not file.name.endswith('.csv'):
            raise serializers.ValidationError(
                "The uploaded file must be a CSV."
              )

        max_size = 50*1024*1024
        if file.size > max_size:
            raise serializers.ValidationError(
                f"The file size exceeds the limit of {max_size/(1024*1024)} MB"
                )

        try:
            file.open()
            # Read a small portion to validate
            csv.Sniffer().sniff(file.read(1024).decode('utf-8'))
            # Reset file pointer after reading
            file.seek(0)
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                'The uploaded file is not a readable CSV'
                )
        return attrs
