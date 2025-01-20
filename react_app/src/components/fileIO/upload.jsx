import React, { useState } from 'react';

const FileUpload = () => {
  const [filePath, setFilePath] = useState('');
  const [fileDetails, setFileDetails] = useState(null);  // To hold the file details
  const [error, setError] = useState(null);  // To hold any errors

  const handleInputChange = (event) => {
    setFilePath(event.target.value);  // User inputs the path or filename
  };

  const handleUpload = async () => {
    if (!filePath) {
      alert('Please provide a file path!');
      return;
    }

    const config = { filepath: filePath };  // Send this path as config

    try {
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setFileDetails(result);  // Store the file details from the backend
      setError(null);  // Clear any previous errors
    } catch (err) {
      setError(`Error: ${err.message}`);
      setFileDetails(null);  // Clear the file details if error occurs
    }
  };

  return (
    <div>
      <h1>Upload File Path</h1>
      <input
        type="text"
        placeholder="Enter file path or filename"
        onChange={handleInputChange}
      />
      <button onClick={handleUpload} disabled={!filePath}>
        Upload
      </button>

      {filePath && <p>File Path: {filePath}</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fileDetails && (
        <div>
          <h2>File Details:</h2>
          <ul>
            <li><strong>Filename:</strong> {fileDetails.filename}</li>
            <li><strong>Time Range:</strong> {fileDetails.time_range}</li>
            <li><strong>Coordinates:</strong> {fileDetails.coordinates.join(', ')}</li>
            <li><strong>Variables:</strong> {fileDetails.variables.join(', ')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
