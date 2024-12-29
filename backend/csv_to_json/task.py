import io
import json
import pandas as pd
from celery import shared_task
from django.utils.timezone import now
from django.core.files.storage import default_storage
from .models import CSVUpload


@shared_task
def process_csv(file_id, formatted_filename):
    print("In celery task, the File_id => ", file_id)
    try:

        file_instance = CSVUpload.objects.get(id=file_id)
        file_path = file_instance.file.path

        # Read CSV file and convert it to JSON
        csv_file = pd.read_csv(file_path)
        json_data = []
        for _, row in csv_file.iterrows():
            json_data.append(row.to_dict())

        # Save the JSON file to the media directory
        json_file = io.StringIO(json.dumps(json_data))
        json_file_path = f'processed/{formatted_filename}.json'
        json_file_full_path = default_storage.save(
                              json_file_path,
                              json_file)

        # Update the file instance with the result path
        file_instance.result_url = json_file_full_path
        file_instance.processed_at = now()
        file_instance.save()

        return True

    except Exception as err:
        print(f"Error processing file: {err}")
        return False
