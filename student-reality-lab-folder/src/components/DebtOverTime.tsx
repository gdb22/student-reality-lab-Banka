import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import data from "../data/processed.json";

export default function DebtOverTimeChart() {
  return (
    <div style={{ marginTop: "60px" }}>
      <h2>Average Student Loan Balance Over Time</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="average_balance"
            stroke="#ff7300"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
