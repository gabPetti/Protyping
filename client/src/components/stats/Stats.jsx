import { useState, useEffect, useRef } from "react";
import "./stats.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;
const DEFAULT_MODE = "TIME";

export default function Stats({ onEnd, started }) {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [totalWords, setTotalWords] = useState(DEFAULT_WORDS);
  const [time, setTime] = useState(DEFAULT_TIME);

  // timer end handler
  function handleEnd() {
    onEnd(true);
  }

  // timer that counts down until 0
  useEffect(() => {
    if (started === true && mode === "TIME") {
      const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);
      return () => {
        time == 1 && handleEnd();
        clearInterval(timer);
      };
    }
  }, [time, started]);

  const handleConfig = (e) => {
    started = false;
    console.log(started)
    if (e === "mode" && mode === "TIME") {
      setMode("WORDS");
    } else if (e === "mode" && mode === "WORDS") {
      setMode("TIME");
    } else if (mode === "TIME") {
      setTime(e);
    } else if (mode === "WORDS") {
      setTotalWords(e);
    }
  };

  return (
    <>
      <div className="statsWrapper">
        <div className="stats">
          <span id="wpm">
            {} WPM • {mode === "TIME" ? time + "s" : "0/" + totalWords}
          </span>
        </div>
        <div className="statsConfig">
          <button onClick={() => handleConfig(15)}>15</button>
          <button onClick={() => handleConfig(30)}>30</button>
          <button onClick={() => handleConfig(60)}>60</button>
          <button onClick={() => handleConfig("mode")}>{mode}</button>
        </div>
      </div>
    </>
  );
}
