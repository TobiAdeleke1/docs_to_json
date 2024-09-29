from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CSVUploadSerializer
from .task import process_csv


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello World From CSV_to_JSON'})


class CSVUploadView(APIView):
    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)
        if serializer.is_valid():
            # Save file to the database
            file_instance = serializer.save()

            # Trigger Celery task asynchronously
            process_csv.delay(file_instance.id)

            return Response(
                {"message": "File uploaded successfully."},
                status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
