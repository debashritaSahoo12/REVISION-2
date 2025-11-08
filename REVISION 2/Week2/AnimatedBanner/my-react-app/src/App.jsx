import AnimatedBanner from "./AnimatedBanner";
import "./App.css";

function App() {
  return (
    <div className="app">
      <AnimatedBanner
        texts={["Create.", "Learn.", "Grow."]}
        typingSpeed={120}
        erasingSpeed={60}
        delayBeforeErase={1000}
        delayBeforeNext={500}
        loop={true}
      />
    </div>
  );
}

export default App;
