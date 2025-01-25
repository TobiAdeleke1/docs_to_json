import io
import json
import os
import pandas as pd
from datetime import timedelta
from celery import shared_task
from django.utils.timezone import now
from django.core.files.storage import default_storage
from django.core.mail import EmailMessage
from django.conf import settings
from .models import CSVUpload


@shared_task
def process_csv(file_id, formatted_filename):
    print("In celery process_csv task, the File_id => ", file_id)
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


@shared_task
def send_email(file_instance_id, user_email):
    print("In celery send_email task, the user_email => ", user_email)
    error = None
    try:

        file_instance = CSVUpload.objects.get(id=file_instance_id)

        if not file_instance:
            error = 'File instance not found'
            return error

        json_filepath = os.path.join(settings.MEDIA_ROOT, file_instance.result_url)
        subject = "Converted Json Subject"
        text_content = "Download Converted Data, which is in Json form"
        from_email = "csv2jsonapp@example.com"
        to = user_email
        message = EmailMessage(
            subject,
            text_content,
            from_email,
            [to],
        )
        message.attach_file(json_filepath, "application/json")
        message.send()
        return error

    except Exception as err:
        return err


@shared_task
def clear_records():
    today = now()
    yesterdate = today - timedelta(days=1)

    # Get all the data that are 1 day one and deleted_at is null
    day_old_records = CSVUpload.objects.filter(
                       processed_at__gt=yesterdate,
                       deleted_at__isnull=True
                       ).values()

    for item in day_old_records:
        item_json_path = os.path.join(settings.MEDIA_ROOT, item['result_url'])
        item_csv_path = os.path.join(settings.MEDIA_ROOT, item['file'])

        try:
            if os.path.exists(item_json_path):
                os.remove(item_json_path)

            if os.path.exists(item_csv_path):
                os.remove(item_csv_path)

            CSVUpload.objects.filter(id=item['id']).update(deleted_at=today)
        except Exception as err:
            print("Could not remove file at %s due to %s"
                  % (item_csv_path, err))
