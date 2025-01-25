from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import xarray as xr
import os
from fastapi.middleware.cors import CORSMiddleware
import json

# Set current working directory to the directory of this file
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from check_coords_attrs import check_all
from plots.time_series import ts_plot_init
from plots.spatial_plot import plot_test_spatial

app = FastAPI()

loaded_dataset = {}

# set the active file to None
active_file = None  # Store the active file globally

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

class FilePathRequest(BaseModel):
    filepath: str

@app.post("/upload/")
async def process_file(request: FilePathRequest):
    global active_file
    file_path = request.filepath

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=400, detail="File not found")

    try:
        if file_path not in loaded_dataset:
            ds = xr.open_dataset(file_path)
            loaded_dataset[file_path] = ds
        else:
            ds = loaded_dataset[file_path]

        active_file = file_path  # Set the active file
        checker = check_all(ds)
        coord_names = checker.check_coords()
        var_names = checker.check_vars()
        time_range = checker.check_time()
        spatial = str(checker.check_spatial())

        return {
            "message": "File uploaded and set as active",
            "filename": os.path.basename(file_path),
            "time_range": time_range,
            "coordinates": coord_names,
            "variables": var_names,
            "spatial": spatial
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/set_active_file/")
async def set_active_file(request: FilePathRequest):
    global active_file
    file_path = request.filepath

    if file_path not in loaded_dataset:
        raise HTTPException(status_code=400, detail="File not uploaded yet")
    
    active_file = file_path
    return {"message": f"Active file set to {file_path}"}

@app.get("/get_active_file/")
async def get_active_file():
    if not active_file:
        raise HTTPException(status_code=400, detail="No active file set")
    return {"active_file": active_file}


@app.get("/active-file/")
async def active_file_status():
    global active_file
    if active_file:
        return {"active": True}
    else:
        return {"active": False}



@app.get("/stats/")
async def get_statistics():
    if not active_file:
        raise HTTPException(status_code=400, detail="No active file set")

    try:
        ds = loaded_dataset[active_file]
        stats = ds.to_dataframe().describe().to_dict()
        return {"filename": os.path.basename(active_file), "statistics": stats}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/plot/")
async def plot():
    if not active_file:
        raise HTTPException(status_code=400, detail="No active file set")

    try:
        ds = loaded_dataset[active_file]
        coord_names = check_all(ds).check_coords()
        var_names = check_all(ds).check_vars()

        new_ds = ds.isel(lat=0, lon=0)
        new_df = new_ds.to_dataframe().reset_index()
        var_name = var_names[0]
        x = 'hour'
        y = var_name

        plotter = ts_plot_init()
        fig = plotter.tes_plot(new_df, x, y, f"{var_name} vs {x}")

        plot_json = json.loads(fig.to_json())
        return plot_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/spatial_plot/")
async def spatial_plot():
    if not active_file:
        raise HTTPException(status_code=400, detail="No active file set")
    
    try:
        plot_json = plot_test_spatial(loaded_dataset[active_file]).plot_gv()
        return plot_json
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
