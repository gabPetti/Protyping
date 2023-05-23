import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import Stats from "../stats/Stats";
import "./typetest.sass";
const DEFAULT_WORDS = 30;
const DEFAULT_TIME = 30;
const DEFAULT_MODE = "TIME";

export default function Typetest({ onQuery }) {
  const [caret, setCaret] = useState({ left: 0, top: 6, line: 1, init: false });
  const [words, setWords] = useState([]);
  const [totalWords, setTotalWords] = useState(60);
  const [refresh, setRefresh] = useState(0);
  const [started, setStarted] = useState(false);
  const inputElement = useRef();
  const [end, setEnd] = useState(false);
  // var stats = { wpm, accuracy, consistency, rightChars, wrongChars };

  // transition to dashboard
  useEffect(() => {
    if (end === true) {
      onQuery({
        wpm: 0,
        accuracy: 0,
        consistency: 0,
        rightChars: document.querySelectorAll("span.correct").length,
        wrongChars:
          document.querySelectorAll("span.incorrect").length +
          document.querySelectorAll("span.extra").length,
        finished: true,
      });
    }
  }, [end]);

  $("body").keydown((e) => {
    if (e.repeat) {
      return;
    }
    var tabKey = 9;
    var zKey = 90;
    var vKey = 86;
    if (e.keyCode == tabKey) {
      console.log("refresh");
      e.preventDefault();
      setRefresh((x) => x + 1);
    }
    if (
      ((e.ctrlKey || e.metaKey) && e.keyCode == zKey) ||
      ((e.ctrlKey || e.metaKey) && e.keyCode == vKey)
    ) {
      console.log("you cannot use this shortcut");
      e.preventDefault();
      return false;
    }
  });

  $("input:not(#inputElement)").on("blur", function() {
    console.log("back to test")
    inputElement.current.focus();
  })

  // Generate words to the test
  useEffect(() => {
    var wordsArray = [];
    inputElement.current.value = "";
    var wordGenerated;

    for (let i = 0; i < totalWords; i++) {
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
  }, [totalWords, refresh]);

  // Compare input text with the words of the test
  const handleInput = () => {
    setStarted(true);
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
        } else if (words[i][j] == undefined) {
          copyWords[i][j] = { text: userInput[i][j], status: "extra" };
        } else if (userInput[i][j] === undefined) {
          copyWords[i][j].status = "";
        } else if (words[i][j] == "\xa0") {
          copyWords[i][j].status = "";

          // normal - wrong char
        } else if (
          userInput[i][j] != words[i][j].text &&
          copyWords[i][j].status != "extra"
        ) {
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
    if (
      copyWords[userInput.length - 1][userInput[userInput.length - 1].length] ==
      undefined
    ) {
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
        <Stats started={started} onEnd={setEnd} />
        <div className="typetestInput">
          <input
            id="inputElement"
            type="text"
            autoFocus
            onChange={handleInput}
            ref={inputElement}
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
