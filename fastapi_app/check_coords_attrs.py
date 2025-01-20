

class check_all:
    def __init__(self, ds):
        self.ds = ds

    def check_coords(self):
        return list(self.ds.coords.keys())

    def check_vars(self):
        return list(self.ds.data_vars.keys())

    def check_time(self):
        coord_names = self.check_coords()
        time_coord_name = next((coord for coord in coord_names if 'time' in coord.lower()), None)
        if time_coord_name:
            times = self.ds[time_coord_name].values
            time_range = f"{str(times[0])} to {str(times[-1])}"
        else:
            time_range = "No time dimension found"
        return time_range


    def check_spatial(self):
        coord_names = self.check_coords()
        lat_exists = any(word.lower() in ["lat", "latitude"] for word in coord_names)

        lon_exists = any(word.lower() in ['lon','longitude'] for word in coord_names)

        if lat_exists and lon_exists:
            spatial = True
        else:
            spatial = False
        return spatial

    def check_attrs(self):
        return self.ds.attrs

    def check_global_attrs(self):
        return self.ds.attrs.keys()

    def check_global_attr(self, attr_name):
        return self.ds.attrs[attr_name]

    def check_coord_attrs(self, coord_name):
        return self.ds[coord_name].attrs

    def check_var_attrs(self, var_name):
        return self.ds[var_name].attrs