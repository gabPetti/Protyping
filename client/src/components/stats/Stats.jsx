import { useState, useEffect, useRef } from "react";
import "./stats.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;

export default function Stats(props) {
  const [started, setStarted] = useState(false);
  const inputSeconds = useRef(DEFAULT_TIME);

  const decreaseSeconds = () => {
    setSeconds((prevSeconds) => {
      if (prevSeconds > 0) {
        return --prevSeconds;
      } else {
        endTest();
        return inputSeconds;
      }
    });
  };

  const increaseSeconds = () => {
    setSeconds((prevSeconds) => {
      return ++prevSeconds;
    });
  };

  //uncomment to check if interval is running even after ending
  // useEffect(() => {
  //   console.log('test')
  // }, [seconds])

  useEffect(() => {
    console.log(`has ${started}`);
    let intervalID;
    if (started == "Started") {
      intervalID = setInterval(
        inputSeconds.current == 0 ? increaseSeconds : decreaseSeconds,
        1000
      );
    }
    return () => clearInterval(intervalID);
  }, [started]);

  //bug? if you click start multiple times around the time it reaches 0, the program crashes
  const startTest = () => {
    if (started == "Paused") {
      setSeconds(seconds);
      //setStatus('Started')
    } else if (started == "Ended") {
      setSeconds(inputSeconds.current);
      //setStatus('Started')
    }
    setStatus("Started");
  };

  const endTest = () => {
    if (started == "Started") {
      setSeconds(0);
      setStatus("Ended");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      inputSeconds.current = e.target.value;
    }
  };

  return (
    <>
      <span id="wpm">0 WPM</span>
      <span>&nbsp;•&nbsp;</span>
      {props.mode === "TIME" ? <span id="seconds">{props.time} s</span> : <span id="words">0/{props.totalWords}</span>}
    </>
  );
}
