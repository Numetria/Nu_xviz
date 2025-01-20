from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import xarray as xr
import traceback
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith(('.nc', '.nc4', '.hdf', '.h5')):
        return jsonify({'error': 'Invalid file format. Only NetCDF or HDF files are supported.'}), 400

    try:
        # Open dataset directly from file stream
        file_stream = BytesIO(file.read())
        ds = xr.open_dataset(file_stream)

        # Process coordinates and dimensions
        coord_names = list(ds.coords.keys())
        time_coord_name = next((coord for coord in coord_names if 'time' in coord.lower()), None)
        lat_exists = any(coord.lower() in ['lat', 'latitude'] for coord in coord_names)
        lon_exists = any(coord.lower() in ['lon', 'longitude'] for coord in coord_names)
        spatial = lat_exists and lon_exists

        if time_coord_name:
            times = pd.to_datetime(ds[time_coord_name].values).strftime('%Y-%m-%d %H:%M:%S')
            time_txt = f'{times[0]} to {times[-1]}'
        else:
            time_txt = 'No time dimension found'

        return jsonify({
            'time_range': time_txt,
            'spatial': spatial,
            'coordinates': coord_names
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 300

if __name__ == '__main__':
    app.run(debug=True)
