from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import xarray as xr
import os
from fastapi.middleware.cors import CORSMiddleware
import json
# set current working directory to the directory of this file

os.chdir(os.path.dirname(os.path.abspath(__file__)))

from check_coords_attrs import check_all
from plots.time_series import ts_plot_init


app = FastAPI()

loaded_dataset = {}
origins = ['http://localhost:5173']

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Change this to ['http://localhost:3000'] if React runs there
    allow_credentials=True,
    allow_methods=["POST"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class FilePathRequest(BaseModel):
    filepath: str

@app.post("/upload/")
async def process_file(request: FilePathRequest):
    file_path = request.filepath

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=400, detail="File not found")

    try:
        if file_path not in loaded_dataset:
            ds = xr.open_dataset(file_path)
            loaded_dataset[file_path] = ds
        else:
            ds = loaded_dataset[file_path]
        

        checker = check_all(ds)
        coord_names = checker.check_coords()
        var_names = checker.check_vars()
        time_range = checker.check_time()
        spatial = str(checker.check_spatial())
        

        return {
            "filename": os.path.basename(file_path),
            "time_range": time_range,
            "coordinates": coord_names,
            "variables": var_names,
            "spatial": spatial
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.post("/plot/")
async def plot(request: FilePathRequest):
    file_path = request.filepath

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=400, detail="File not found")

    try:
        if file_path not in loaded_dataset:
            ds = xr.open_dataset(file_path)
            loaded_dataset[file_path] = ds
        else:
            ds = loaded_dataset[file_path]

        coord_names = check_all(ds).check_coords()
        var_names = check_all(ds).check_vars()
        
        new_ds = ds.isel(lat=0,lon=0)
        new_df = new_ds.to_dataframe().reset_index()
        # Get the first variable in the dataset
        var_name = var_names[0]
        x = 'hour'
        y = var_name

        plotter = ts_plot_init()
        fig = plotter.tes_plot(new_df, x, y, f"{var_name} vs {x}")

        plot_json = json.loads(fig.to_json())
        

        return plot_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)