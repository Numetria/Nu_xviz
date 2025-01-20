import React, { useState } from 'react';
import axios from 'axios';

const LoadDataButton = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const loadData = () => {
        axios.get('http://127.0.0.1:5000/upload')  // Replace with your Flask server URL
            .then(response => {
                setData(response.data.slice(0, 5));  // Get the first 5 rows of the DataFrame
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div>
            <button 
                onClick={loadData} 
                style={{
                    padding: '10px 15px', 
                    fontSize: '14px', 
                    cursor: 'pointer', 
                    borderRadius: '5px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    border: 'none',
                    margin: '10px'
                }}
            >
                Load Data
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {data.length > 0 && (
                <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoadDataButton;
