import React, { useState } from "react";

const PlotDisplaySPATIAL = () => {
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);

  const handlePlotRequest = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/spatial_plot/", {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("No file uploaded. Please upload a file first.");
        } else {
          throw new Error(`Error fetching plot: ${response.status}`);
        }
      }

      const result = await response.json();
      setPlotData(result);
      setError(null);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
      setPlotData(null);
    }
  };

  return (
    <div>
      <h1>Display Bokeh Plot</h1>
      <button onClick={handlePlotRequest}>Show Plot</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {plotData && (
        <div>
          <script
            src="https://cdn.bokeh.org/bokeh/release/bokeh-3.3.0.min.js"
          ></script>
          <div id="bokeh-plot"></div>
          <script>
            {plotData &&
              `Bokeh.embed.embed_item(${JSON.stringify(plotData)}, "bokeh-plot");`}
          </script>
        </div>
      )}
    </div>
  );
};

export default PlotDisplaySPATIAL;
