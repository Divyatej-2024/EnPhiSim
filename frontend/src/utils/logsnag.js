import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function Dashboard() {
  useEffect(() => {
    logEvent("Page View", "Visited /dashboard");
  }, []);

  return <div>Dashboard</div>;
}

export async function logEvent(event, description = "") {
  if (!API_URL) {
    console.warn("⚠️ API URL not configured — logging skipped");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/logsnag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("❌ LogSnag error:", err.message);
  }
}
