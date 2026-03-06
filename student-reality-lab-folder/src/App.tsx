import './App.css'
import DebtOverTimeChart from './components/DebtOverTime'

function App() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Has the Average Student Loan Balance Increased Over Time?</h1>
        <p className="annotation">
          The average student loan balance increased from $18,230 in 2007 to
          $39,550 in 2025 — a rise of $21,320 over 18 years.
        </p>
      </header>

      <section className="interaction">
        <h3>Interaction</h3>
        <p>
          Hover over the line to see the exact average balance for each year.
        </p>
      </section>

      <DebtOverTimeChart />

      <section className="story">
        <h3>Story</h3>
        <p>
          This line chart shows a steady increase in average student loan balance
          over the past twenty years. Although there were some fluctuations
          throughout the years there is a consistent increase. With this
          substantial increase, it raises a question whether student loans will
          increase throughout the next couple of years. If it does then it would
          negatively impact future college students who want to seek an
          affordable education. In the last twenty years student loans have
          risen $18,000, imagine the increase in the next twenty years. This
          shows why this can be a potential problem in the future. It is very
          important that the rate of student loans stabilize or at least
          decrease. The financial strain current college students face can
          already be difficult to manage. This chart helps spread awareness
          about the student loan crisis and how it affects many college students.
          Being educated on this topic can help future students better
          understand the potential consequences of taking student loans.
        </p>
      </section>
    </main>
  )
}

export default App
