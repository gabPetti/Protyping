import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import Stats from "../stats/Stats";
import "./typetest.sass";
var errorChars = 0;
var oldInputElement = 0;

export default function Typetest({ onQuery }) {
  const [caret, setCaret] = useState({ left: 0, top: 6, line: 1, init: false });
  const [words, setWords] = useState([]);
  const [typedChars, setTypedChars] = useState("12");
  const [time, setTime] = useState();
  
  const [mode, setMode] = useState("TIME");
  const [totalWords, setTotalWords] = useState(30);
  const [totalTime, setTotalTime] = useState(30);
  
  const [wpm, setWpm] = useState(0)
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
    if ((e.ctrlKey || e.metaKey) && e.keyCode == zKey || (e.ctrlKey || e.metaKey) && e.keyCode == vKey) {
      e.preventDefault();
      return false;
    }
  }

  // transition to dashboard
  useEffect(() => {
    if (end === true) {
      onQuery({
        wpm: wpm,                                                    // kinda working
        accuracy: (typedChars - errorChars) * 100 / typedChars,      // kinda working
        raw: 0,                                                      // not working
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
    errorChars = 0;
    oldInputElement = 0;

    var wordsArray = [];
    inputElement.current.value = "";
    var wordGenerated;
    var wordsNum = mode === "TIME" ? 200 : totalWords;
    for (let i = 0; i < wordsNum; i++) {
      wordGenerated =
        wordList.words[Math.floor(Math.random() * 9904)].split("");
      for (let j = 0; j < wordGenerated.length; j++) {
        wordGenerated[j] = {
          text: wordGenerated[j],
          status: "",
        };
      }
      wordGenerated.push({ text: "\xa0" });
      wordsArray = wordsArray.concat([wordGenerated]);
    }
    wordsArray[0][0].status = "active";
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

    // word input checker
    for (let i = Math.max(0, inputLength - 2); i < Math.min(totalWords, inputLength + 1); i++) {
      userInput[i] == undefined ? (subInputLength = 0) : (subInputLength = userInput[i].length);
      words[i].pop();
      for (let j = 0; j < Math.max(subInputLength, words[i].length); j++) {
        // correction - next word unwriten
        if (userInput[i] === undefined) {
          copyWords[i][j].status = "";
        } else if (
          userInput[i][j] == undefined &&
          words[i][j].status == "extra"
        ) {
          while (j < words[i].length) {
            copyWords[i].pop();
          }
        } else if (j > userInput[i].length - 1) {
          copyWords[i][j].status = "";

          // extra char
        } else if (words[i][j] == undefined) {
          copyWords[i][j] = { text: userInput[i][j], status: "extra" };
          errorChars++;

          // not typed/backspaced char
        } else if (userInput[i][j] === undefined) {
          copyWords[i][j].status = "";

          // space
        } else if (words[i][j] == "\xa0") {
          copyWords[i][j].status = "";

          // normal - wrong char
        } else if (
          userInput[i][j] != words[i][j].text &&
          copyWords[i][j].status != "extra"
        ) {
          if (words[i][j].status != "incorrect") {
            errorChars++;
          }
          copyWords[i][j].status = "incorrect";

          // normal - right char
        } else if (
          userInput[i][j] == words[i][j].text &&
          copyWords[i][j].status != "extra"
        ) {
          copyWords[i][j].status = "correct";
        }
      }
      words[i].push({ text: "\xa0" });
    }

    // locate active word
    if (copyWords[userInput.length - 1][userInput[userInput.length - 1].length] == undefined) {
      copyWords[userInput.length][0].status = "active";
    } else {
      copyWords[userInput.length - 1][
        userInput[userInput.length - 1].length
      ].status = "active";
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
          onEnd={setEnd}
          getTime={setTime}
          getWpm={setWpm}
          getTotalWords={setTotalTime}
          getTotalTime={setTotalWords}
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
