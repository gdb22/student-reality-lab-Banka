import { useMemo, useState } from 'react'

import debtOverTimeData from '../data/processed.json'
import repaymentPeriodData from '../data/repayment-period.json'

type DebtOverTimeDatum = {
  year: number
  average_balance: number
}

type RepaymentPeriodDatum = {
  total_debt: number
  repayment_years: number
}

type RepaymentBracket = {
  min: number
  max: number
  years: number
  label: string
}

const presetAmounts = [15000, 30000, 45000, 60000]

const repaymentBrackets: RepaymentBracket[] = [
  { min: 1, max: 7500, years: 10, label: 'Standard repayment window' },
  { min: 7501, max: 9999, years: 12, label: 'Slightly extended repayment window' },
  { min: 10000, max: 19999, years: 15, label: 'Mid-range debt repayment window' },
  { min: 20000, max: 39999, years: 20, label: 'Long-term repayment window' },
  { min: 40000, max: 59999, years: 25, label: 'Heavy debt repayment window' },
  { min: 60000, max: Number.POSITIVE_INFINITY, years: 30, label: 'Very long repayment window' },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const wholeNumberFormatter = new Intl.NumberFormat('en-US')

const formatCurrency = (value: number) => currencyFormatter.format(value)

const clampAmount = (value: number, max: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return Math.min(Math.round(value), max)
}

const getRepaymentEstimate = (amount: number) => {
  if (amount <= 0) {
    return {
      years: 0,
      label: 'No repayment estimate yet',
      range: 'Enter a balance above $0 to see an estimate.',
    }
  }

  const bracket = repaymentBrackets.find(
    ({ min, max }) => amount >= min && amount <= max,
  )

  if (!bracket) {
    return {
      years: 30,
      label: 'Very long repayment window',
      range: 'High debt balances often remain in repayment for decades.',
    }
  }

  const maximumLabel = Number.isFinite(bracket.max)
    ? formatCurrency(bracket.max)
    : `${formatCurrency(bracket.min)}+`

  return {
    years: bracket.years,
    label: bracket.label,
    range: `${formatCurrency(bracket.min)} to ${maximumLabel}`,
  }
}

export default function LoanRepaymentEstimator() {
  const debtData = debtOverTimeData as DebtOverTimeDatum[]
  const repaymentData = repaymentPeriodData as RepaymentPeriodDatum[]

  const latestAverageDebt = debtData.at(-1)?.average_balance ?? 39550
  const earliestAverageDebt = debtData[0]?.average_balance ?? 18230
  const maxSliderAmount = Math.max(
    latestAverageDebt,
    ...repaymentData.map((entry) => entry.total_debt),
  )

  const [loanAmount, setLoanAmount] = useState(latestAverageDebt)

  const estimate = useMemo(() => getRepaymentEstimate(loanAmount), [loanAmount])

  const debtDifference = loanAmount - latestAverageDebt
  const isAboveAverage = debtDifference > 0
  const principalOnlyMonthlyPace =
    estimate.years > 0 ? Math.ceil(loanAmount / (estimate.years * 12)) : 0
  const growthSince2007 = latestAverageDebt - earliestAverageDebt

  const handleAmountChange = (rawValue: string) => {
    const numericValue = Number(rawValue.replace(/[^\d.]/g, ''))
    setLoanAmount(clampAmount(numericValue, 250000))
  }

  return (
    <section className="estimator-shell">
      <div className="estimator-panel">
        <div className="panel-copy">
          <span className="section-tag">Try your own number</span>
          <h2>Enter a loan balance and get a repayment estimate.</h2>
          <p>
            The estimate below uses the repayment ranges from your student loan
            dataset. It gives visitors a quick sense of how much repayment time
            can expand as debt grows.
          </p>
        </div>

        <div className="input-card">
          <label className="field-label" htmlFor="loan-amount-input">
            Student loan balance
          </label>

          <div className="currency-input">
            <span>$</span>
            <input
              id="loan-amount-input"
              type="number"
              min="0"
              max="250000"
              step="500"
              value={loanAmount}
              onChange={(event) => handleAmountChange(event.currentTarget.value)}
            />
          </div>

          <input
            className="amount-slider"
            type="range"
            min="0"
            max={maxSliderAmount}
            step="500"
            value={Math.min(loanAmount, maxSliderAmount)}
            onChange={(event) => handleAmountChange(event.currentTarget.value)}
            aria-label="Adjust student loan balance"
          />

          <div className="slider-labels">
            <span>$0</span>
            <span>{formatCurrency(maxSliderAmount)}</span>
          </div>

          <div className="preset-row">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                className={`preset-button${loanAmount === amount ? ' active' : ''}`}
                onClick={() => setLoanAmount(amount)}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="results-grid">
        <article className="result-card emphasis">
          <span className="result-label">Estimated repayment time</span>
          <strong>{estimate.years === 0 ? '—' : `~${estimate.years} years`}</strong>
          <p>{estimate.label}</p>
        </article>

        <article className="result-card">
          <span className="result-label">Debt range matched</span>
          <strong>{estimate.range}</strong>
          <p>Based on the repayment-period ranges already used in this project.</p>
        </article>

        <article className="result-card">
          <span className="result-label">Compared with 2025 average debt</span>
          <strong>
            {loanAmount === latestAverageDebt
              ? 'Right at the average'
              : `${isAboveAverage ? '+' : '-'}${formatCurrency(Math.abs(debtDifference))}`}
          </strong>
          <p>
            The latest average balance in your dataset is {formatCurrency(latestAverageDebt)}.
          </p>
        </article>

        <article className="result-card">
          <span className="result-label">Principal-only monthly pace</span>
          <strong>
            {principalOnlyMonthlyPace === 0 ? '—' : `${formatCurrency(principalOnlyMonthlyPace)}/mo`}
          </strong>
          <p>This simple pace excludes interest and shows the scale of repayment.</p>
        </article>
      </div>

      <section className="insight-panel">
        <div>
          <span className="section-tag">Project insight</span>
          <h3>Average balances have already climbed sharply.</h3>
          <p>
            In your data, the average student loan balance rises from{' '}
            {formatCurrency(earliestAverageDebt)} in 2007 to {formatCurrency(latestAverageDebt)} in 2025,
            an increase of {formatCurrency(growthSince2007)}.
          </p>
        </div>

        <div className="insight-callout">
          <span>{wholeNumberFormatter.format(repaymentData.length)} dataset points</span>
          <strong>
            {loanAmount <= 0
              ? 'Add a balance to begin.'
              : `${formatCurrency(loanAmount)} could keep someone repaying for about ${estimate.years} years.`}
          </strong>
        </div>
      </section>
    </section>
  )
}