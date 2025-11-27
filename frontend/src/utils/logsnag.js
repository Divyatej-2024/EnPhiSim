import { useEffect } from "react";
import { logEvent } from "../utils/logsnag";

export default function Dashboard() {
  useEffect(() => {
    logEvent("Page View", "Visited /dashboard");
  }, []);

  return <div>Dashboard</div>;
}

export async function logEvent(event, description = "") {
  try {
    await fetch("/api/logsnag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, description }),
    });
  } catch (err) {
    console.error("LogSnag error:", err);
  }
}
