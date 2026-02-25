import React, { useState } from "react";

export default function LevelPlayer({ level }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const text = level?.sampleEmail?.body || level?.level_text || "";

      const predRes = await fetch(`${apiUrl}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const pred = await predRes.json();
      const correct = action === "report";

      setResult({
        correct,
        xpAwarded: correct ? 10 : 0,
        mlPrediction: pred.prediction ?? "unknown",
        mlConfidence: pred.confidence ?? null,
      });
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed" });
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>{level?.title || level?.page_title || "Level"}</h2>
      <p>
        <strong>From:</strong> {level?.sampleEmail?.from || level?.from_and_to || "N/A"}
      </p>
      <p>
        <strong>Subject:</strong> {level?.sampleEmail?.subject || level?.subj || "N/A"}
      </p>
      <pre>{level?.sampleEmail?.body || level?.phish_email || level?.level_text || ""}</pre>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => handleAction("report")} disabled={loading}>
          Report
        </button>
        <button onClick={() => handleAction("delete")} disabled={loading}>
          Delete
        </button>
        <button onClick={() => handleAction("click")} disabled={loading}>
          Click link
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 10 }}>
          <p>Correct: {String(result.correct)}</p>
          <p>XP awarded: {result.xpAwarded}</p>
          <p>
            ML prediction: {result.mlPrediction} ({String(result.mlConfidence)})
          </p>
        </div>
      )}
    </div>
  );
}