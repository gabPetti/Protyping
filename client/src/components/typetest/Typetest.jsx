import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import Stats from "../stats/Stats";
import "./typetest.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;
const DEFAULT_MODE = "TIME";
var activeWord
var rightChars = document.querySelectorAll('span.correct').length;

export default function Typetest() {
  const [caret, setCaret] = useState({ left: 0, top: 0, line: 1, init: false })
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState(DEFAULT_MODE);
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
      wordGenerated.push({text: "\xa0"})
      wordsArray = wordsArray.concat([wordGenerated]);
    }
    wordsArray[0][0].status = "active";
    setWords([...wordsArray]);
  }, [totalWords]);

  // Compare input text with the words of the test
  const handleInput = () => {
    var userInput = inputElement.current.value;
    userInput = userInput.split(" ");
    //userInput = userInput.map(x => x + "\xa0");
    userInput = userInput.map(x => x.split(""));
    var copyWords = words;
    var inputLength;
    var subInputLength;
    userInput.length == undefined ? inputLength = 0 : inputLength = userInput.length;

    // word input checker

    for (let i = Math.max(0, inputLength - 2); i < inputLength + 1; i++) {
      userInput[i] == undefined ? subInputLength = 0 : subInputLength = userInput[i].length;
      words[i].pop()
      for (let j = 0; j < Math.max(subInputLength, words[i].length); j++) {
        // correction - next word unwriten
        if (userInput[i] === undefined) {
          copyWords[i][j].status = ""
        } else if (userInput[i][j] == undefined && words[i][j].status == "extra") {
          while (j < words[i].length) {copyWords[i].pop();}
        } else if (j > userInput[i].length - 1) {
          copyWords[i][j].status = "";
        } else if (words[i][j] == undefined) {
          copyWords[i][j] = { text: userInput[i][j], status: "extra" };
        } else if (userInput[i][j] === undefined) {
          copyWords[i][j].status = "";
        } else if (words[i][j] == "\xa0") {
          copyWords[i][j].status = "";

        // normal - wrong char
        } else if (userInput[i][j] != words[i][j].text && copyWords[i][j].status != "extra") {
          copyWords[i][j].status = "incorrect";

        // normal - right char
        } else if (userInput[i][j] == words[i][j].text && copyWords[i][j].status != "extra") {
          copyWords[i][j].status = "correct";
        }
      }
      words[i].push({text: "\xa0"})
    }

    if (copyWords[userInput.length - 1][userInput[userInput.length - 1].length] == undefined) {
      copyWords[userInput.length][0].status = "active";
    } else {
      copyWords[userInput.length - 1][userInput[userInput.length - 1].length].status = "active";
    }

    
    
    setWords([...copyWords]);
  };
  
  // caret smooth effect
  useEffect(() => {
    console.log(caret)
    const elem = document.querySelector("span.active");
    if (elem != null) {
      var line = caret.line;
      var init = caret.init;
      const rect = elem.getBoundingClientRect();
      if (rect.top > caret.top) {
        const box = document.querySelector(".typetestText")
        line++;
        if (caret.line > 2) {box.scrollBy(0, 42)}
      } else if (rect.top < caret.top) {
        const box = document.querySelector(".typetestText")
        line--;
        if (caret.line > 2) {box.scrollBy(0, 42)}
      }
      init = true
      setCaret({ left: rect.left, top: rect.top, line: line, init: init })
    }
  }, [words])

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
            style={{color: "black"}}
          />
        </div>
        <div id="caret" style={{left: caret.left, top: caret.top}}></div>
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
