import geoviews as gv
import geoviews.feature as gf
import xarray as xr
from cartopy import crs


class plot_test_spatial:

    def __init__(self, ds):
        self.ds = ds

    
    def plot_gv(self):
        indata = self.ds
        dset_surface = indata.isel(level=-1).isel(time=range(0,10))

        gv.extension('bokeh')


        dataset = gv.Dataset(dset_surface, ['longitude', 'latitude', 'time'], 't', crs=crs.PlateCarree())


        spa_ds = dataset.data.to_dict()

        return spa_ds