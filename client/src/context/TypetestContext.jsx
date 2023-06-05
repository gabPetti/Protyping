import React, { createContext, useState } from 'react';
const DEFAULT_MODE = "TIME"
const DEFAULT_TIME = 30
const DEFAULT_WORDS = 30

// Create the context object
export const TypetestContext = createContext();

// Optional: Create a provider component
export const TypetestContextProvider = ({ children }) => {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [totalTime, setTotalTime] = useState(DEFAULT_TIME);
  const [totalWords, setTotalWords] = useState(DEFAULT_WORDS);

  const [typedChars, setTypedChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);

  const [time, setTime] = useState(DEFAULT_TIME);
  const [wpm, setWpm] = useState(0);
  const [wpmArray, setWpmArray] = useState([]);
  const [raw, setRaw] = useState(0);

  // Define any functions or state updates needed

  // Update typedChars
  const updateTypedChars = (newTypedChars) => {
    setTypedChars(newTypedChars);
  };

  // Update correctChars
  const updateCorrectChars = (newCorrectChars) => {
    setCorrectChars(newCorrectChars);
  };

  // Update Mode
  const updateMode = (newMode) => {
    setMode(newMode);
  };
  
  // Update totalWords
  const updateTotalWords = (newTotalWords) => {
    setTotalWords(newTotalWords);
  };

  // Update totalTime
  const updateTotalTime = (newTotalTime) => {
    setTotalTime(newTotalTime);
  };

  // Update Raw
  const updateRaw = (newRaw) => {
    setRaw(newRaw);
  };

  // Update Wpm
  const updateWpm = (newWpm) => {
    setWpm(newWpm);
  };

  // Update WpmArray
  const updateWpmArray = (newWpmArray) => {
    setWpmArray(newWpmArray);
  };

  // Update Time
  const updateTime = (newTime) => {
    setTime(newTime);
  };

  // Create the context value object
  const contextValue = {
    mode,
    totalTime,
    totalWords,
    typedChars,
    correctChars,
    time,
    wpm,
    wpmArray,
    raw,
    updateMode,
    updateTotalTime,
    updateTotalWords,
    updateTime,
    updateWpm,
    updateWpmArray,
    updateRaw,
    updateTypedChars,
    updateCorrectChars
  };
  
  // Return the provider component with the context value
  return (
    <TypetestContext.Provider value={contextValue}>
      {children}
    </TypetestContext.Provider>
  );
};