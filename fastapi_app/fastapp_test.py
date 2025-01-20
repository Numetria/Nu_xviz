from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import xarray as xr
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


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
        ds = xr.open_dataset(file_path)

        coord_names = list(ds.coords.keys())
        var_names = list(ds.data_vars.keys())

        time_coord_name = next((coord for coord in coord_names if 'time' in coord.lower()), None)
        if time_coord_name:
            times = ds[time_coord_name].values
            time_range = f"{str(times[0])} to {str(times[-1])}"
        else:
            time_range = "No time dimension found"

        ds.close()

        return {
            "filename": os.path.basename(file_path),
            "time_range": time_range,
            "coordinates": coord_names,
            "variables": var_names
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)