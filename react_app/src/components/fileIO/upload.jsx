import React, { useState } from 'react';

const FileUpload = () => {
  const [filePath, setFilePath] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setFilePath(event.target.value);
  };

  const handleUpload = async () => {
    if (!filePath) {
      alert('Please provide a file path!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/upload/', {
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
      setFileDetails(result);
      setError(null);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setFileDetails(null);
    }
  };

  return (
    <div>
      <h2>Upload NetCDF File</h2>
      <input
        type="text"
        placeholder="Enter file path"
        value={filePath}
        onChange={handleInputChange}
      />
      <button onClick={handleUpload} disabled={!filePath}>
        Upload
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fileDetails && (
        <div>
          <h3>File Details</h3>
          <ul>
            <li><strong>Filename:</strong> {fileDetails.filename}</li>
            <li><strong>Time Range:</strong> {fileDetails.time_range}</li>
            <li><strong>Coordinates:</strong> {fileDetails.coordinates.join(', ')}</li>
            <li><strong>Variables:</strong> {fileDetails.variables.join(', ')}</li>
            <li><strong>Spatial:</strong> {fileDetails.spatial}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
