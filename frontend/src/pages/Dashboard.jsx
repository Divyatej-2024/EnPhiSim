// src/pages/Dashboard.jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Clicked Links", value: 30 },
  { name: "Ignored", value: 50 },
  { name: "Reported", value: 20 },
];
const COLORS = ["#ff6666", "#66bb6a", "#42a5f5"];

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Awareness Dashboard</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          label
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
