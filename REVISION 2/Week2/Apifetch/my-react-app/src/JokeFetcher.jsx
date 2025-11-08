import { useState, useRef } from "react";
import "./JokeFetcher.css";

export default function JokeFetcher() {
  const [currentJoke, setCurrentJoke] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(1);

  // Used to ensure only latest fetch updates state
  const fetchIdRef = useRef(0);

  const getJokes = async (num = 1) => {
    setLoading(true);
    setError("");
    const currentFetchId = ++fetchIdRef.current;

    try {
      const requests = Array.from({ length: num }, () =>
        fetch("https://official-joke-api.appspot.com/random_joke").then((r) => {
          if (!r.ok) throw new Error("Network error");
          return r.json();
        })
      );

      const results = await Promise.all(requests);

      // If another fetch started before this finished, ignore results
      if (currentFetchId !== fetchIdRef.current) return;

      const newJokes = results.map((j) => ({
        id: j.id,
        setup: j.setup,
        punchline: j.punchline,
      }));

      // The first one is the "current joke"
      const latestJoke = newJokes[newJokes.length - 1];

      setCurrentJoke(latestJoke);

      // Add to history (keep latest 5 only)
      setHistory((prev) => {
        const updated = [...newJokes, ...prev].slice(0, 5);
        return updated;
      });
    } catch (err) {
      if (currentFetchId === fetchIdRef.current) {
        setError("Failed to fetch joke.");
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentJoke(null);
  };

  // Find the longest setup in history
  const longestSetup =
    history.length > 0
      ? history.reduce((longest, j) =>
          j.setup.length > longest.setup.length ? j : longest
        )
      : null;

  return (
    <div className="joke-container">
      <h1>😂 Random Joke Generator</h1>

      <div className="controls">
        <button onClick={() => getJokes(1)} disabled={loading}>
          {loading ? "Loading..." : "Get Random Joke"}
        </button>

        <div className="multi-fetch">
          <input
            type="number"
            min="1"
            max="5"
            value={count}
            onChange={(e) =>
              setCount(Math.min(5, Math.max(1, Number(e.target.value))))
            }
          />
          <button onClick={() => getJokes(count)} disabled={loading}>
            {loading ? "Loading..." : `Fetch ${count} Jokes`}
          </button>
        </div>

        <button onClick={clearHistory} disabled={!history.length}>
          Clear History
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {currentJoke && !loading && (
        <div className="current-joke">
          <p>
            <strong>{currentJoke.setup}</strong>
          </p>
          <p>{currentJoke.punchline}</p>
        </div>
      )}

      <h2>History (Last 5 Jokes)</h2>
      {history.length === 0 ? (
        <p>No jokes yet.</p>
      ) : (
        <ul className="joke-history">
          {history.map((j) => (
            <li
              key={j.id}
              className={
                longestSetup && longestSetup.id === j.id
                  ? "highlight"
                  : undefined
              }
            >
              <strong>{j.setup}</strong> — {j.punchline}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
