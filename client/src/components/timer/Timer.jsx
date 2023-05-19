import { useState, useEffect, useRef } from "react";

const DEFAULT_SECONDS = 3

export default function Timer() {
  const [status, setStatus] = useState('Ended');
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const inputSeconds = useRef(DEFAULT_SECONDS)
  
  const decreaseSeconds = () => {
    setSeconds((prevSeconds) => {
      if (prevSeconds > 0) {
        return --prevSeconds
      } else {
        endTest()
        return inputSeconds
      }
    })
  };

  const increaseSeconds = () => {
    setSeconds((prevSeconds) => {
      return ++prevSeconds
    })
  };

  //uncomment to check if interval is running even after ending
  // useEffect(() => {
  //   console.log('test')
  // }, [seconds])
  
  useEffect(() => {
    console.log(`has ${status}`);
    let intervalID
    if (status == 'Started') {
      intervalID = setInterval(inputSeconds.current == 0 ? increaseSeconds : decreaseSeconds, 1000)
    }
    return () => clearInterval(intervalID)
  }, [status])

  //bug? if you click start multiple times around the time it reaches 0, the program crashes
  const startTest = () => {
    if (status == 'Paused') {
      setSeconds(seconds)
      //setStatus('Started')
    } else if(status == 'Ended') {
      setSeconds(inputSeconds.current)
      //setStatus('Started')
    }
    setStatus('Started')
  }

  const pauseTest = () => {
    if (status == 'Started') {
      setStatus('Paused')
    }
  }
  
  const endTest = () => {
    if (status == 'Started') {
      setSeconds(0)
      setStatus('Ended')
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      inputSeconds.current = e.target.value
    }
  }
  
  return (
    <div>
      <span>{seconds}s</span>
      <input type='text' onChange={startTest}></input>
      <input type='text' onKeyDown={handleKeyDown}></input>
      <button onClick={startTest}>Start</button>
      <button onClick={startTest}>Resume</button>
      <button onClick={pauseTest}>Pause</button>
      <button onClick={endTest}>End</button>
      <button></button>
    </div>
  )
}