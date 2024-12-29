from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CSVUploadSerializer
from .task import process_csv
from .util import get_filefield_name


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
                     f"File uploaded successfully {formatted_filename}."},
                    status=status.HTTP_201_CREATED)

        return Response(
                {"message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST)
