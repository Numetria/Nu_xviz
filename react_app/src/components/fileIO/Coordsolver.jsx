import React, { useState } from 'react';


const coordlist = () => {
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);

  const handlePlotRequest = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('No file uploaded. Please upload a file first.');
        } else {
          throw new Error(`Error fetching plot: ${response.status}`);
        }
      }

      const result = await response.json();
      setPlotData(result);
      setError(null);
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
      setPlotData(null);
    }
  };

  return (
      <section className={styles.forecast} aria-label="forecast label">
        <h2>Select an Variable:</h2>
        <div className={styles.cardWrapper}>
          <select value={selectedValue} onChange={handleChange} className={styles.dropdown}>
            {randomStrings.map((str, index) => (
              <option key={index} value={str}>
                {str}
              </option>
            ))}
          </select>
          {selectedValue && <p>You selected: {selectedValue}</p>}
        </div>
      </section>
    );
};

export default coordlist;    