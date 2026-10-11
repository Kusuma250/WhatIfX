import { useState } from "react";
import "./App.css";

function App() {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [whatIfHours, setWhatIfHours] = useState("");
  const [completedHours, setCompletedHours] = useState("");
   const currentOutcome = result ? result.realisticCase : 0;
   const whatIfOutcome = result ? result.whatIfRealisticCase : 0;
   const completed = Number(completedHours) || 0;

const progressPercent =
  result && result.totalHours > 0
    ? Math.min(
        Math.round((completed / result.totalHours) * 100),
        100
      )
    : 0;
   const maxOutcome = Math.max(
  currentOutcome,
  whatIfOutcome,
  1
);

const clearHistory = () => {
  setHistory([]);
};
  const simulateFuture = () => {
    const totalHours = Number(days) * Number(hours);
    const whatIfTotalHours =
  Number(days) * Number(whatIfHours || hours);

  if (!goal.trim()) {
  alert("Please enter your goal.");
  return;
}

if (
  days === "" ||
  !Number.isFinite(Number(days)) ||
  Number(days) <= 0 ||
  !Number.isInteger(Number(days))
) {
  alert("Please enter a valid number of days.");
  return;
}

if (
  hours === "" ||
  !Number.isFinite(Number(hours)) ||
  Number(hours) <= 0
) {
  alert("Please enter valid hours per day.");
  return;
}

if (whatIfHours !== "" && Number(whatIfHours) <= 0) {
  alert("What-If hours must be greater than zero.");
  return;
}

    let consistency;

    if (days <= 30) {
      consistency = 0.85;
    } else if (days <= 90) {
      consistency = 0.75;
    } else {
      consistency = 0.65;
    }

    let difficultyFactor;

    if (difficulty === "Easy") {
      difficultyFactor = 1.0;
    } else if (difficulty === "Medium") {
      difficultyFactor = 0.85;
    } else {
      difficultyFactor = 0.7;
    }

    const bestCase = Math.round(
      totalHours * difficultyFactor
    );

    const realisticCase = Math.round(
      totalHours * consistency * difficultyFactor
    );

    const whatIfRealisticCase = Math.round(
  whatIfTotalHours * consistency * difficultyFactor
);
const improvement = whatIfRealisticCase - realisticCase;
const improvementPercent =
  realisticCase > 0
    ? Math.round((improvement / realisticCase) * 100)
    : 0;

    const worstCase = Math.round(
      totalHours * 0.5 * difficultyFactor
    );

    const realisticProbability = Math.round(
      consistency * 100
    );

    const bestProbability = Math.round(
      (100 - realisticProbability) * 0.4
    );

    const worstProbability =
      100 - realisticProbability - bestProbability;

    setResult({
      totalHours,
      whatIfTotalHours,
      whatIfRealisticCase,
      improvement,
      improvementPercent,
      bestCase,
      realisticCase,
      worstCase,
      bestProbability,
      realisticProbability,
      worstProbability,
      consistency,
      difficulty,
    });
    setHistory((prevHistory) => [
  ...prevHistory,
  {
    goal,
    days: Number(days),
    hours: Number(hours),
    whatIfHours: Number(whatIfHours || hours),
    realisticCase,
    whatIfRealisticCase,
  },
]);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>WhatIfX</h1>
          <p>Personal Decision & Outcome Simulator</p>
        </div>
      </header>

      <main className="container">

        <section className="hero">
          <h2>What could happen if you choose this path?</h2>

          <p>
            Explore different possible outcomes based on your
            time, consistency, and goal difficulty.
          </p>
        </section>

        <section className="card input-card">

          <h2>Define Your Goal</h2>

          <label>What is your goal?</label>

          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Learn Java in 60 days"
          />

          <div className="input-row">

            <div>
              <label>Number of days</label>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="60"
              />
            </div>

            <div>
              <label>Hours per day</label>

              <input
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="2"
              />
            </div>

          </div>
        <label>
  What if you study more hours per day? (Optional)
</label>

        <input
        type="number"
        min="1"
        value={whatIfHours}
        onChange={(e) => setWhatIfHours(e.target.value)}
        placeholder="Example: 4"
        />
          <label>Goal difficulty</label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button onClick={simulateFuture}>
            Simulate My Future
          </button>

        </section>

        {result && (

          <section className="results">

            <div className="result-header">

              <h2>Possible Futures</h2>

              <p>
                Available time:{" "}
                <strong>
                  {result.totalHours} hours
                </strong>
              </p>
              <p>
  What-If available time:{" "}
  <strong>
    {result.whatIfTotalHours} hours
  </strong>
</p>
<p>
  Additional time gained:{" "}
  <strong>
    {result.whatIfTotalHours - result.totalHours} hours
  </strong>
</p>

              <p>
                Goal difficulty:{" "}
                <strong>
                  {result.difficulty}
                </strong>
              </p>

            </div>

            <div className="scenario-grid">

              <div className="scenario best">

                <span className="badge">
                  BEST CASE
                </span>

                <h3>
                  {result.bestCase} hours
                </h3>

                <p>
                  {result.bestProbability}% probability
                </p>

                <small>
                  High consistency and favorable conditions.
                </small>

              </div>

              <div className="scenario realistic">

                <span className="badge">
                  REALISTIC CASE
                </span>

                <h3>
                  {result.realisticCase} hours
                </h3>

                <p>
                  {result.realisticProbability}% probability
                </p>

                <small>
                  Normal interruptions and realistic consistency.
                </small>

              </div>

              <div className="scenario worst">

                <span className="badge">
                  WORST CASE
                </span>

                <h3>
                  {result.worstCase} hours
                </h3>

                <p>
                  {result.worstProbability}% probability
                </p>

                <small>
                  Low consistency and frequent interruptions.
                </small>

              </div>
              <div className="scenario whatif">

  <span className="badge">
    WHAT-IF CASE
  </span>

  <h3>
    {result.whatIfRealisticCase} hours
  </h3>

  <p>
    If you increase your daily hours
  </p>

  <small>
    This shows how your realistic outcome changes
    when you increase the time spent per day.
  </small>
  <p>
  Improvement:{" "}
  <strong>
    +{result.improvement} hours
  </strong>
</p>
<p>
  Improvement:{" "}
  <strong>
    +{result.improvementPercent}%
  </strong>
</p>

</div>

            </div>
           <div className="chart-card">

  <h3>Current vs What-If Outcome</h3>

  <div className="chart">

    <div className="bar-group">
      <div
        className="bar current-bar"
        style={{
          height: `${(currentOutcome / maxOutcome) * 300}px`,
        }}
      >
        <span>{currentOutcome}h</span>
      </div>

      <p>Current Plan</p>
    </div>

    <div className="bar-group">
      <div
        className="bar whatif-bar"
        style={{
          height: `${(whatIfOutcome / maxOutcome) * 300}px`,
        }}
      >
        <span>{whatIfOutcome}h</span>
      </div>

      <p>What-If Plan</p>
    </div>

  </div>

</div>
           
<div className="progress-card">
  <h3>🎯 Goal Progress Tracker</h3>

  <p>Track the hours you have completed toward your goal.</p>

  <label>Hours completed so far</label>

  <input
    type="number"
    min="0"
    max={result.totalHours}
    value={completedHours}
    onChange={(e) => {
  const value = e.target.value;

  if (
  value === "" ||
  (Number(value) >= 0 &&
    Number(value) <= result.totalHours)
) {
  setCompletedHours(value);
}
}}
    placeholder="Example: 10"
  />

  <div className="progress-info">
    <strong>{progressPercent}% complete</strong>
    <span>
      {Math.min(completed, result.totalHours)} / {result.totalHours} hours
    </span>
  </div>

  <div className="progress-track">
    <div
      className="progress-fill"
      style={{ width: `${progressPercent}%` }}
    />
  </div>
</div>

            <div className="explanation">

              <h3>
                Why this prediction?
              </h3>

              <ul>

                <li>
                  Total available time:
                  {" "}
                  {result.totalHours} hours.
                </li>

                <li>
                  Estimated consistency:
                  {" "}
                  {Math.round(
                    result.consistency * 100
                  )}%.
                </li>

                <li>
                  Goal difficulty:
                  {" "}
                  {result.difficulty}.
                </li>

                <li>
                  Difficulty affects the amount of
                  usable effort expected toward the goal.
                </li>

                <li>
                  The simulator compares multiple
                  possible futures instead of giving
                  one fixed prediction.
                </li>

              </ul>

            </div>

          </section>

        )}
        

        {history.length > 0 && (
          <section className="history">

            <h2>Simulation History</h2>
              
              <button
  className="clear-history-btn"
  onClick={clearHistory}
>
  Clear History
</button>
          
            <div className="history-list">

              {history.map((item, index) => (
                <div className="history-item" key={index}>

                  <h3>{item.goal}</h3>

                  <p>
                    {item.days} days × {item.hours} hours/day
                  </p>

                  <p>
                    Current outcome:{" "}
                    <strong>{item.realisticCase} hours</strong>
                  </p>

                  <p>
                    What-If outcome:{" "}
                    <strong>{item.whatIfRealisticCase} hours</strong>
                  </p>

                </div>
              ))}

            </div>

          </section>
        )}
      </main>
    </div>
  );
}

export default App;