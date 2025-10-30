import React, { useState } from 'react';

const Simulation = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data.prediction || 'Error: No result');
    } catch (err) {
      setResult('Error contacting server');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Phishing Detection Simulation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste email or message text..."
          rows="6"
          style={{ width: '100%' }}
        />
        <button type="submit">Analyze</button>
      </form>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default Simulation;
