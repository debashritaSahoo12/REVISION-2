import { useState, useEffect } from "react";
import "./QuizApp.css";

const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which programming language runs in a web browser?",
    options: ["Python", "C++", "Java", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Ernest Hemingway", "Mark Twain", "Jane Austen"],
    answer: "Harper Lee",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style System",
      "Creative Style Setup",
      "Control Sheet System",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "What is the largest planet in our Solar System?",
    options: ["Earth", "Saturn", "Jupiter", "Mars"],
    answer: "Jupiter",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent Van Gogh",
      "Leonardo da Vinci",
      "Picasso",
      "Michelangelo",
    ],
    answer: "Leonardo da Vinci",
  },
  {
    question: "Which company developed React?",
    options: ["Google", "Microsoft", "Facebook", "Amazon"],
    answer: "Facebook",
  },
];

export default function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = QUESTIONS[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isQuizOver) return;
    if (timer === 0) {
      handleTimeout();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, isQuizOver]);

  const handleTimeout = () => {
    addToHistory("skipped", null, -1);
    setScore((s) => s - 1);
    goToNext();
  };

  const handleAnswer = (option) => {
    if (selected) return; // prevent multiple clicks
    setSelected(option);
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    let feedbackText = "";

    if (option === currentQuestion.answer) {
      feedbackText = "Correct!";
      setScore((s) => s + 1);
      addToHistory("correct", option, +1, timeTaken);
    } else {
      feedbackText = "Wrong!";
      addToHistory("wrong", option, 0, timeTaken);
    }

    setFeedback(feedbackText);
    setTimeout(() => goToNext(), 2000);
  };

  const addToHistory = (status, userAnswer, points, timeTaken) => {
    setHistory((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        correctAnswer: currentQuestion.answer,
        userAnswer,
        status,
        points,
        timeTaken: timeTaken ?? 15,
      },
    ]);
  };

  const goToNext = () => {
    setSelected(null);
    setFeedback("");
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((i) => i + 1);
      setTimer(15);
      setQuestionStartTime(Date.now());
    } else {
      setIsQuizOver(true);
    }
  };

  const handleSkip = () => {
    addToHistory("skipped", null, -1, (Date.now() - questionStartTime) / 1000);
    setScore((s) => s - 1);
    goToNext();
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setTimer(15);
    setIsQuizOver(false);
    setHistory([]);
    setFeedback("");
    setQuestionStartTime(Date.now());
  };

  const correctCount = history.filter((h) => h.status === "correct").length;
  const wrongCount = history.filter((h) => h.status === "wrong").length;
  const skippedCount = history.filter((h) => h.status === "skipped").length;
  const longestTime =
    history.length > 0 ? Math.max(...history.map((h) => h.timeTaken)) : 0;
  const longestQuestion =
    history.find((h) => h.timeTaken === longestTime)?.question || "";

  if (isQuizOver) {
    return (
      <div className="quiz-container">
        <h1>Quiz Summary</h1>
        <p>Total Score: {score}</p>
        <p>✅ Correct: {correctCount}</p>
        <p>❌ Wrong: {wrongCount}</p>
        <p>⏩ Skipped: {skippedCount}</p>
        <p>⏱ Longest Answer Time: {longestTime.toFixed(1)}s</p>

        <h2>Answer History</h2>
        <ul className="history-list">
          {history.map((h, i) => (
            <li
              key={i}
              className={longestQuestion === h.question ? "highlight" : ""}
            >
              <strong>{h.question}</strong> <br />
              {h.status === "skipped" ? (
                <em>Skipped (-1)</em>
              ) : (
                <>
                  You answered: <strong>{h.userAnswer || "N/A"}</strong> —{" "}
                  {h.status === "correct" ? "✅ Correct" : "❌ Wrong"} (
                  {h.points > 0 ? "+1" : h.points === 0 ? "0" : "-1"})
                </>
              )}
              <br />
              <small>Time Taken: {h.timeTaken.toFixed(1)}s</small>
            </li>
          ))}
        </ul>

        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Interactive Quiz App</h1>

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>
      <p>
        Question {currentIndex + 1} of {QUESTIONS.length}
      </p>
      <p className="timer">⏱ Time left: {timer}s</p>

      <div className="question-box">
        <h2>{currentQuestion.question}</h2>
        <div className="options">
          {currentQuestion.options.map((opt) => {
            let className = "";
            if (selected) {
              if (opt === currentQuestion.answer) className = "correct";
              else if (opt === selected) className = "wrong";
            }
            return (
              <button
                key={opt}
                className={className}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <p className="feedback">{feedback}</p>

      <button onClick={handleSkip} disabled={!!selected}>
        Skip Question (-1)
      </button>

      <div className="score">Score: {score}</div>
    </div>
  );
}
