import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import data from "../data/repayment-period.json";

export default function RepaymentPeriodChart() {
  return (
    <div style={{ marginTop: "60px" }}>
      <h2>Debt Size vs. Repayment Time</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="total_debt"
            tickFormatter={(value: number) => `$${value.toLocaleString()}`}
          />

          <YAxis
            dataKey="repayment_years"
            tickFormatter={(value: number) => `${value} yrs`}
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === "total_debt" && typeof value === "number") {
                return `$${value.toLocaleString()}`;
              }
              if (name === "repayment_years" && typeof value === "number") {
                return `${value} years`;
              }
              return value ?? "";
            }}
            labelFormatter={(label) =>
              typeof label === "number"
                ? `Debt: $${label.toLocaleString()}`
                : `Debt: ${label ?? ""}`
            }
          />

          <Line
            type="monotone"
            dataKey="repayment_years"
            stroke="#4c6ef5"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
