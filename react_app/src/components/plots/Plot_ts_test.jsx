import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const PlotDisplay = () => {
  const [filePath, setFilePath] = useState('');
  const [plotData, setPlotData] = useState(null);

  const handleInputChange = (event) => {
    setFilePath(event.target.value);  // Set the file path from input
  };

  const handlePlotRequest = async () => {
    if (!filePath) {
      alert('Please provide a file path!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/plot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filepath: filePath }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setPlotData(result);  // Store the plot JSON data

    } catch (err) {
      console.error("Error:", err.message);
      alert('Failed to generate plot.');
    }
  };

  return (
    <div>
      <h1>Display Plot</h1>
      <input
        type="text"
        placeholder="Enter file path"
        onChange={handleInputChange}
      />
      <button onClick={handlePlotRequest} disabled={!filePath}>
        Show Plot
      </button>

      {plotData && (
        <Plot
          data={plotData.data}
          layout={plotData.layout}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
};

export default PlotDisplay;
