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

type DebtOverTimeDatum = {
  year: number;
  average_balance: number;
};

const normalizeNumber = (value: unknown) => {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const normalizeData = (raw: unknown): DebtOverTimeDatum[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const record = entry as Record<string, unknown>;
      const year = normalizeNumber(record.year);
      const averageBalance = normalizeNumber(record.average_balance);

      if (year === null || averageBalance === null) {
        return null;
      }

      return {
        year,
        average_balance: averageBalance
      };
    })
    .filter((entry): entry is DebtOverTimeDatum => entry !== null);
};

const debtOverTimeData = normalizeData(data);

const formatCurrency = (value: unknown) => {
  const numeric = normalizeNumber(value);
  if (numeric === null) {
    return "$0";
  }

  return `$${numeric.toLocaleString()}`;
};

export default function DebtOverTimeChart() {
  return (
    <section className="chart-section">
      <h2>Average Student Loan Balance Over Time</h2>

      {debtOverTimeData.length === 0 ? (
        <p>No data available for the selected period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={debtOverTimeData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="year" />

            <YAxis
              tickFormatter={formatCurrency}
              label={{
                value: "Average Balance (USD)",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip formatter={(value) => formatCurrency(value)} />

            <Line
              type="monotone"
              dataKey="average_balance"
              stroke="#ff4d4f"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
