import json
from bokeh.plotting import figure
from bokeh.transform import linear_cmap
from bokeh.models import ColumnDataSource
from bokeh.embed import json_item
from bokeh.util.hex import hexbin
from numpy.random import standard_normal
from flask import jsonify




def get_plot():
    # Generate data
    x = standard_normal(50000)
    y = standard_normal(50000)
    bins = hexbin(x, y, 0.1)

    # Create Bokeh plot
    p = figure(tools="", match_aspect=True, background_fill_color='#440154')
    p.grid.visible = False

    p.hex_tile(q="q", r="r", size=0.1, line_color=None, source=bins,
               fill_color=linear_cmap('counts', 'Viridis256', 0, max(bins.counts)))

    # Convert to JSON and return
    plot_json = json_item(p, "my_plot")
    return jsonify(plot_json)