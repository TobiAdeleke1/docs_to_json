from datetime import datetime


def get_filefield_name(initial_filename):
    try:
        new_name = initial_filename.split('/')[-1].split('.csv')[0]
        return new_name

    except Exception as err:
        print("Failed to get filename becuase: ", err)
        return f'file_at_{datetime.now().strftime("%Y%m%d%H%M%S")}'
