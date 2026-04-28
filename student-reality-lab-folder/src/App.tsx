import './App.css'
import LoanRepaymentEstimator from './components/LoanRepaymentEstimator'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">Interactive student loan estimator</span>
        <h1>See how long student debt could stay with you.</h1>
        <p className="annotation">
          Instead of showing charts, this version lets visitors enter a student
          loan balance and instantly see an estimated repayment window based on
          the debt ranges in your project data.
        </p>
      </header>

      <LoanRepaymentEstimator />

      <ChatBot />

      <section className="story-card">
        <h2>Why this matters</h2>
        <p>
          Student loan debt is easier to understand when people can compare the
          numbers to their own situation. This estimator turns your project into
          something visitors can interact with directly, making the long-term
          impact of borrowing more personal and easier to remember.
        </p>
        <p>
          The estimate uses the repayment ranges already present in your dataset,
          so it should be treated as an educational benchmark rather than exact
          financial advice. It is designed to help users understand how quickly
          repayment timelines can stretch as debt increases.
        </p>
      </section>
    </main>
  )
}

export default App