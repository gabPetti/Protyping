import { useState, useEffect } from "react";
import "./stats.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;
const DEFAULT_MODE = "TIME";
var totalTime = DEFAULT_TIME;

export default function Stats({ onEnd, started, getTotalTime, getTotalWords, getMode, getWpm, typedChars }) {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [totalWords, setTotalWords] = useState(DEFAULT_WORDS);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [wpm, setWpm] = useState(0);

  function handleWpm() {
    if (time > 0) {
      setWpm(Math.round(typedChars * 12 / (totalTime - time + 1)))
    }
  }
  
  // timer end handler
  function handleEnd() {
    getWpm(wpm);
    onEnd(true);
  }

  // timer that counts down until 0
  useEffect(() => {
    if (started == true && time > 0) {
      const interval = setInterval(() => {
        setTime(time - 1);
        handleWpm();
      }, 1000);
      return () => clearInterval(interval);
    } else if (time < 1){
      handleEnd();
    } else if (started == false) {
      setWpm(0);
    }
  }, [time, started]);

  const handleConfig = e => {
    if (e === "mode" && mode === "TIME") {
      getMode("WORDS");
      setMode("WORDS");
    } else if (e === "mode" && mode === "WORDS") {
      getMode("TIME");
      setMode("TIME");
    } else if (mode === "TIME") {
      totalTime = e
      getTotalTime(e)
      setTime(e);
    } else if (mode === "WORDS") {
      // totalWords = e
      getTotalWords(e);
      setTotalWords(e);
    }
  };

  return (
    <>
      <div className="statsWrapper">
        <div className="stats">
          <span id="wpm">
            {wpm} WPM • {mode === "TIME" ? time + "s" : "0/" + totalWords}
          </span>
        </div>
        <div className="statsConfig">
          <button onClick={() => handleConfig(5)}>5</button>
          <button onClick={() => handleConfig(30)}>30</button>
          <button onClick={() => handleConfig(60)}>60</button>
          <button onClick={() => handleConfig("mode")}>{mode}</button>
        </div>
      </div>
    </>
  );
}
