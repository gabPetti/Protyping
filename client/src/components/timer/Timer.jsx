import { useState, useEffect, useRef } from "react";

const DEFAULT_SECONDS = 3

export default function Timer() {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const inputSeconds = useRef(DEFAULT_SECONDS)
  
  const decreaseSeconds = () => {
    setSeconds((prevSeconds) => {
      if (prevSeconds > 0) {
        return --prevSeconds
      } else {
        endTest()
      }
    })
  };
  
  useEffect(() => {
    let timer
    if (started) {
      timer = setInterval(decreaseSeconds, 1000)
    }
    return () => clearInterval(timer)
  }, [started])

  const startTest = () => {
    if (!started) {
      setStarted(true)
      setSeconds(inputSeconds.current)
      console.log('has Started')
    }
  }
  
  const endTest = () => {
    if (started) {
      setSeconds(0)
      setStarted(false)
      console.log('has Ended')
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
      <button onClick={endTest}>End</button>
      <button></button>
    </div>
  )
}