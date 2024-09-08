from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello World From CSV_to_JSON'})


class CSVUploadView(APIView):
    def post(self, request):
        pass
