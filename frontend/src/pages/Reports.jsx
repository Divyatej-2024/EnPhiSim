// src/pages/Reports.jsx
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "email", headerName: "Email Text", width: 300 },
  { field: "prediction", headerName: "Model Result", width: 200 },
];

const rows = [
  { id: 1, email: "Win a free iPhone!", prediction: "Phishing" },
  { id: 2, email: "Meeting scheduled at 10 AM", prediction: "Legit" },
];

export default function Reports() {
  return (
    <div style={{ height: 400, width: "80%", margin: "auto", marginTop: "2rem" }}>
      <h2>Simulation Reports</h2>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
