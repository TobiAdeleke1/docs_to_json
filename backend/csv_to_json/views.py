from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
from .serializers import CSVUploadSerializer
from .models import CSVUpload
from .task import process_csv
from .util import get_filefield_name
import os


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello World From CSV_to_JSON'})


class CSVUploadView(APIView):
    def post(self, request):

        serializer = CSVUploadSerializer(data=request.data)

        if serializer.is_valid():

            # Save file to the database
            file_instance = serializer.save()

            # Get formatted file name
            formatted_filename = get_filefield_name(file_instance.file.name)

            # Trigger Celery task
            process_csv.delay(file_instance.id,
                              formatted_filename)

            return Response(
                    {"message":
                     f"File uploaded successfully {formatted_filename}.",
                     "fileID":
                     file_instance.id},
                    status=status.HTTP_201_CREATED)

        return Response(
                {"message": serializer.errors,
                 "fileID": None},
                status=status.HTTP_400_BAD_REQUEST)


class JSONDownloadView(APIView):
    throttle_classes = [AnonRateThrottle]

    def get(self, request, pk):
        try:
            file_instance = CSVUpload.objects.get(pk=pk)
        except Exception as err:
            print(err)
            return Response({'error': 'File not found'},
                            status=status.HTTP_404_NOT_FOUND)

        # Get Json filepath
        json_filepath = os.path.join(settings.MEDIA_ROOT, file_instance.result_url)

        if not os.path.exists(json_filepath):
            return Response({'error': 'File not found'},
                            status=status.HTTP_404_NOT_FOUND)

        try:
            formatted_filename = get_filefield_name(file_instance.file.name)

            response = FileResponse(open(json_filepath, 'rb'),
                                    as_attachment=True,
                                    filename=f'{formatted_filename}.json')

            return response
        except Exception as err:
            print(err)
            return Response({'error': 'Error Loading File'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmailSendView(APIView):
    pass
