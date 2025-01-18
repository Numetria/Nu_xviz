from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import xarray as xr


app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']

    # Ensure the file is not empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Read the uploaded file as a pandas DataFrame
    try:
        ds = xr.open_dataset(file)
        coord_names = list(ds.coords.keys())
        time_exists = "time" in {str(word).lower() for word in coord_names}

        time_coord_name = next((coord for coord in ds.coords if 'time' in coord.lower()), None)

        lat_exists = any(word.lower() in ["lat", "latitude"] for word in coord_names)

        lon_exists = any(word.lower() in ['lon','longitude'] for word in coord_names)

        if lat_exists and lon_exists:
            spatial = True
        else:
            spatial = False

        if time_exists:
            time_coord_name = next((coord for coord in ds.coords if 'time' in coord.lower()), None)
            times = pd.to_datetime(ds[time_coord_name].values).strftime('%Y-%m-%d %H:%M:%S')
            time_txt = f'{times[0]} to {times[-1]}'

        return time_txt
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


