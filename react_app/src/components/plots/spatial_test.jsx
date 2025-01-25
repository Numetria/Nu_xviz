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

  // Function to embed the Bokeh plot once plotData is available
  const renderBokehPlot = (plotJson) => {
    if (window.Bokeh && plotJson) {
      Bokeh.embed.embed_item(plotJson, "bokeh-plot");
    }
  };

  // Trigger plot rendering once plotData is fetched
  if (plotData && typeof window !== "undefined") {
    renderBokehPlot(plotData);
  }

  return (
    <div>
      <h1>Display Bokeh Plot</h1>
      <button onClick={handlePlotRequest}>Show Plot</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div id="bokeh-plot"></div>
    </div>
  );
};

export default PlotDisplaySPATIAL;
