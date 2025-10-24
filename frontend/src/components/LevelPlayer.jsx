// frontend/src/components/LevelPlayer.jsx
import React, { useState } from 'react';
import { submitAttempt, mlPredict } from '../services/api';

export default function LevelPlayer({ level }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    const payload = { action, timeTaken: 10, hintsUsed: 0, userId: 'student1' };
    try {
      const res = await submitAttempt(level.level, payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{level.title}</h2>
      <p><strong>From:</strong> {level.sampleEmail.from}</p>
      <p><strong>Subject:</strong> {level.sampleEmail.subject}</p>
      <pre>{level.sampleEmail.body}</pre>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => handleAction('report')} disabled={loading}>Report</button>
        <button onClick={() => handleAction('delete')} disabled={loading}>Delete</button>
        <button onClick={() => handleAction('click')} disabled={loading}>Click link</button>
      </div>

      {result && (
        <div style={{ marginTop: 10 }}>
          <p>Correct: {String(result.correct)}</p>
          <p>XP awarded: {result.xpAwarded}</p>
          <p>ML prediction: {result.mlPrediction} ({result.mlConfidence})</p>
        </div>
      )}
    </div>
  );
}
