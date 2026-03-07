export type DebtOverTimeDatum = {
  year: number;
  average_balance: number;
};

export const normalizeNumber = (value: unknown): number | null => {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const parseDebtOverTimeData = (raw: unknown): DebtOverTimeDatum[] => {
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
