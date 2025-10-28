// src/pages/Simulation.jsx
import { useState } from "react";
import { Button, Card, Typography } from "@mui/material";
import axios from "axios";

export default function Simulation() {
  const [email, setEmail] = useState("Click to fetch a phishing email...");
  const [result, setResult] = useState("");

  const fetchEmail = async () => {
    const res = await axios.get("http://localhost:5000/get_email");
    setEmail(res.data.email);
  };

  const detectPhishing = async () => {
    const res = await axios.post("http://localhost:5000/detect", { email });
    setResult(res.data.prediction);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Card sx={{ padding: "2rem", mb: 3 }}>
        <Typography variant="h5">Phishing Simulation</Typography>
        <Typography sx={{ mt: 2 }}>{email}</Typography>
        <Button sx={{ mt: 2, mr: 2 }} variant="contained" onClick={fetchEmail}>
          Get Random Email
        </Button>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={detectPhishing}>
          Analyze with ML
        </Button>
      </Card>
      {result && <Typography variant="h6">Result: {result}</Typography>}
    </div>
  );
}
