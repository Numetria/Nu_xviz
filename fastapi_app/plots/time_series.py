import plotly.express as px

class ts_plot_init:

    def __init__(self):
        pass
    
    def tes_plot(self,df,x,y,title):
        fig = px.line(df, x=x, y=y, title=title)
        return fig
    



