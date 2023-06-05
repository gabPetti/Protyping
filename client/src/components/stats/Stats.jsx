import { useState, useEffect, useContext } from "react";
import { TypetestContext } from "../../context/TypetestContext";
import "./stats.sass";

export default function Stats() {
  const [timer, setTimer] = useState(0);
  const {
    started,
    wpm,
    wpmArray,
    mode,
    totalTime,
    totalWords,
    time,
    typedChars,
    correctChars,
    updateMode,
    updateTotalTime,
    updateTime,
    updateWpm,
    updateEnd,
    updateWpmArray,
    updateRaw
  } = useContext(TypetestContext);

  function handleWpm() {
    if (time > 0) {
      updateWpm(Math.round((correctChars * 12) / (totalTime - time + 1)));
      updateWpmArray([...wpmArray, Math.round((correctChars * 12) / (totalTime - time + 1))]);
    }
  }

  function handleRaw() {
    if (time > 0) {
      updateRaw(Math.round((typedChars * 12) / (totalTime - time + 1)));
    }
  }

  // timer end handler
  function handleEnd() {
    updateEnd(true);
  }

  // updates when timer changes
  useEffect(() => {
    if (timer > 0) {
      updateTime(time - 1);
      handleWpm();
      handleRaw();
    }
  }, [timer]);

  // timer that counts down until 0
  useEffect(() => {
    if (started == true && time > 0) {
      const interval = setInterval(() => {
        setTimer((x) => x + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (time < 1) {
      handleEnd();
    } else if (started == false) {
      updateWpm(0);
    }
  }, [time, started]);

  const handleConfig = (e) => {
    if (e === "mode" && mode === "TIME") {
      updateMode("WORDS");
    } else if (e === "mode" && mode === "WORDS") {
      updateMode("TIME");
    } else if (mode === "TIME") {
      updateTotalTime(e);
      updateTime(e);
    } else if (mode === "WORDS") {
      // totalWords = e
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
          <button onClick={() => handleConfig(15)}>15</button>
          <button onClick={() => handleConfig(30)}>30</button>
          <button onClick={() => handleConfig(60)}>60</button>
          {/* <button onClick={() => handleConfig("mode")}>{mode}</button> */}
        </div>
      </div>
    </>
  );
}
