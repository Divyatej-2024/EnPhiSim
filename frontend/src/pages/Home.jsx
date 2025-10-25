// src/pages/Home.jsx
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        EnPhiSim – Phishing Awareness & Detection
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Learn how phishing works through interactive simulations and see how
        machine learning models detect real attacks.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/simulation")}
      >
        Start Simulation
      </Button>
    </Container>
  );
}
