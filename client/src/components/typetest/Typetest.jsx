import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import Stats from "../stats/Stats";
import "./typetest.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;
const DEFAULT_MODE = "TIME";

export default function Typetest() {
  const [mode, setMode] = useState(DEFAULT_MODE)
  const [words, setWords] = useState([]);
  const [totalWords, setTotalWords] = useState(DEFAULT_WORDS);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [started, setStarted] = useState(false);
  const inputElement = useRef();
  // var stats = { wpm, accuracy, consistency, rightChars, wrongChars };

  // Generate words to the test
  useEffect(() => {
    var wordsArray = [];
    inputElement.current.value = "";
    var wordGenerated;
    
    for (let i = 0; i < totalWords; i++) {
      wordGenerated = wordList.words[Math.floor(Math.random() * 9904)].split("");
      for (let j = 0; j < wordGenerated.length; j++) {
        wordGenerated[j] = {
          text: wordGenerated[j],
          status: "",
        };
      }
      wordsArray = wordsArray.concat([wordGenerated]);
    }
    wordsArray[0][0].status = "active";
    setWords([...wordsArray]);
  }, [totalWords]);

  // Compare input text with the words of the test
  const handleInput = () => {
    var userInput = inputElement.current.value;
    userInput = userInput.split(" ");
    userInput = userInput.map((x) => x.split(""));
    var copyWords = words;
    // word input checker
    for (let i = 0; i < userInput.length; i++) {
      for (let j = 0; j < Math.max(userInput[i].length, words[i].length); j++) {
        if (userInput[i][j] == undefined && words[i][j].status == "extra") {
          while (j < words[i].length) {
            copyWords[i].pop();
          }
        } else if (j > userInput[i].length - 1) {
          copyWords[i][j].status = "";
        } else if (words[i][j] == undefined) {
          copyWords[i][j] = { text: userInput[i][j], status: "extra" };
          // right key pressed
        } else if (
          userInput[i][j] != words[i][j].text &&
          copyWords[i][j].status != "extra"
        ) {
          copyWords[i][j].status = "incorrect";
          // right key pressed
        } else if (
          userInput[i][j] == words[i][j].text &&
          copyWords[i][j].status != "extra"
        ) {
          copyWords[i][j].status = "correct";
        }
      }
    }
    setWords([...copyWords]);
  };

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <div className="typetestInfo">
          <div className="typetestStats">
            <Stats started={started} time={time} totalWords={totalWords} mode={mode} />
          </div>
          <div className="typetestConfig">
            <button onClick={(mode === "TIME") ? (() => setTime(15)) : (() => setTotalWords(15))}>15</button>
            <button onClick={mode === "TIME" ? () => setTime(30) : () => setTotalWords(30)}>30</button>
            <button onClick={mode === "TIME" ? () => setTime(60) : () => setTotalWords(60)}>60</button>
            <button onClick={() => setMode(mode === "TIME" ? "WORDS" : "TIME")}>{mode}</button>
          </div>
        </div>
        <div className="typetestInput">
          <input
            type="text"
            autoFocus
            onChange={handleInput}
            ref={inputElement}
          />
        </div>
        <div className="typetestText">
          {words.map((word, i) => (
            <div className="words" key={i}>
              {word.map((letter, j) => (
                <span className={letter.status} key={j}>
                  {letter.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
