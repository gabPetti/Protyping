import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import Stats from "../stats/Stats";
import "./typetest.sass";
var errorChars = 0;
var oldInputElement = 0;

export default function Typetest({ onQuery }) {
  const [caret, setCaret] = useState({ left: 0, top: 6, line: 1, init: false });
  const [words, setWords] = useState([]);
  const [typedChars, setTypedChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [time, setTime] = useState();
  
  const [mode, setMode] = useState("TIME");
  const [totalWords, setTotalWords] = useState(100);
  const [totalTime, setTotalTime] = useState(30);
  
  const [wpm, setWpm] = useState(0);
  const [raw, setRaw] = useState(0);
  const [started, setStarted] = useState(false);
  const [end, setEnd] = useState(false);
  const inputElement = useRef();
  
  // automatic focus on test when not fosusing on another input
  $("body").off().on("click", function () {
      if (!$("input:not(#inputElement)").is(":focus")) {
        inputElement.current.focus();
      }
  });

  // handle when shortcuts are pressed
  function handleKeyDown(e) {
    var zKey = 90;
    var vKey = 86;
    var aKey = 65;
    if ((e.ctrlKey || e.metaKey) && e.keyCode == zKey ||
      (e.ctrlKey || e.metaKey) && e.keyCode == vKey || 
      (e.ctrlKey || e.metaKey) && e.keyCode == aKey) {
      e.preventDefault();
      return false;
    }
  }

  // transition to dashboard
  useEffect(() => {
    if (end === true) {
      onQuery({
        wpm: wpm,                                                    // kinda working
        accuracy: (typedChars - errorChars) * 100 / typedChars,      // kinda working, needs to add error from incorrect spacing
        raw: typedChars,                                             // kinda working
        consistency: 0,                                              // not working
        burst: 0,                                                    // not working
        finished: true,                                              // working
      });
    }
  }, [end]);

  // Reset test
  useEffect(() => {
    // reset variables
    setTypedChars(0);
    setCorrectChars(0);
    errorChars = 0;
    oldInputElement = 0;

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
      wordGenerated.push({ text: "\xa0" });
      wordsArray = wordsArray.concat({ textArray: wordGenerated, status: "" });
    }
    wordsArray[0].textArray[0].status = "active";
    wordsArray[0].status = "active";
    setWords([...wordsArray]);
    setStarted(false)
  }, [mode, totalWords, totalTime]);

  // Compare input text with the words of the test
  const handleInput = () => {
    setStarted(true);
    if (oldInputElement < inputElement.current.value.length) {
      setTypedChars(x => x + 1);
    }
    oldInputElement = inputElement.current.value.length;

    var userInput = inputElement.current.value;
    userInput = userInput.split(" ");
    userInput = userInput.map((x) => x.split(""));
    var copyWords = words;
    var inputLength;
    var subInputLength;
    userInput.length == undefined
      ? (inputLength = 0)
      : (inputLength = userInput.length);

    var iActive;
    var jActive;
    // locate active indexes
    if (copyWords[userInput.length - 1].textArray[userInput[userInput.length - 1].length] == undefined) {
      iActive = userInput.length;
      jActive = 0;
    } else {
      iActive = userInput.length - 1;
      jActive = userInput[userInput.length - 1].length;
    }
  
    // word input checker
    for (let i = Math.max(0, inputLength - 2); i < inputLength + 1; i++) {
      // get previous word, current word and next word length
      userInput[i] == undefined ? (subInputLength = 0) : (subInputLength = userInput[i].length);
      // remove space
      copyWords[i].textArray.pop();

      for (let j = 0; j < Math.max(subInputLength, words[i].textArray.length); j++) {
        // not typed word
        if (userInput[i] === undefined) {
          copyWords[i].textArray[j].status = "";

        // not typed char
        } else if (userInput[i][j] === undefined && i >= iActive && j >= jActive) {
          if (words[i].textArray[j].status != "extra") {
            copyWords[i].textArray[j].status = "";
          } else {
            // remove extra char
            while (j < words[i].textArray.length) {
              copyWords[i].textArray.pop();
            }
          }

        // missed char
        } else if (userInput[i][j] == undefined && words[i].textArray[j].status != "extra") {
          copyWords[i].textArray[j].status = "missed"

        // extra char
        } else if (words[i].textArray[j] == undefined) {
          copyWords[i].textArray[j] = { text: userInput[i][j], status: "extra" };
          errorChars++;
  
        // correct char
        } else if (userInput[i][j] == words[i].textArray[j].text && words[i].textArray[j].status != "extra") {
          if (words[i].textArray[j].status != "correct") {
            setCorrectChars(x => x + 1);
          }
          copyWords[i].textArray[j].status = "correct";
  
        // incorrect char
        } else if (userInput[i][j] != words[i].textArray[j].text && words[i].textArray[j].status != "extra") {
          if (words[i].textArray[j].status != "incorrect") {
            errorChars++;
          }
          copyWords[i].textArray[j].status = "incorrect";
        }
      }
      // retrieve space
      copyWords[i].textArray.push({ text: "\xa0" });
    }
  
    // locate active word
    if (copyWords[userInput.length - 1].textArray[userInput[userInput.length - 1].length] == undefined) {
      copyWords[userInput.length].textArray[0].status = "active";
    } else {
      copyWords[userInput.length - 1].textArray[userInput[userInput.length - 1].length].status = "active";
    }
  
    setWords([...copyWords]);
  };

  // caret smooth effect
  useEffect(() => {
    const elem = document.querySelector("span.active");
    if (elem != null) {
      var line = caret.line;
      var init = caret.init;

      var parentTop = elem.offsetTop;
      var parentLeft = elem.offsetLeft;

      if (parentTop > caret.top) {
        const box = document.querySelector(".typetestText");
        line++;
        if (line > 2) {
          box.scrollBy(0, 42);
        }
      } else if (parentTop < caret.top) {
        const box = document.querySelector(".typetestText");
        line--;
        if (line > 1) {
          box.scrollBy(0, -42);
        }
      }
      var parentTop = elem.offsetTop;
      var parentLeft = elem.offsetLeft;
      init = true;
      setCaret({ left: parentLeft, top: parentTop, line: line, init: init });
    }
  }, [words]);

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <Stats
          started={started}
          typedChars={typedChars}
          correctChars={correctChars}
          onEnd={setEnd}
          getTime={setTime}
          getWpm={setWpm}
          getRaw={setRaw}
          getTotalWords={setTotalWords}
          getTotalTime={setTotalTime}
          getMode={setMode}
        />
        <div className="typetestInput">
          <input
            id="inputElement"
            type="text"
            autoFocus
            onChange={handleInput}
            ref={inputElement}
            onKeyDown={() => handleKeyDown(event)}
          />
        </div>
        <div className="typetestText">
          <div id="caret" style={{ left: caret.left, top: caret.top }}></div>
          {words.map((word, i) => (
            <div className={`words ${word.status}`} key={i}>
              {word.textArray.map((letter, j) => (
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
